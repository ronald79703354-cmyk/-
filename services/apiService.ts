import type { User, Product, Category, CartItem, Order, CustomerInfo, DashboardStats, PaymentMethod } from '../types';
import { Role, OrderStatus } from '../types';
import { supabase } from './supabaseClient';

// Export interfaces for use in components
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  governorate: string;
  age: number;
}


// --- API SERVICE with Supabase ---
export const apiService = {
  loginUser: async ({ email, password }: LoginCredentials): Promise<{ user: User }> => {
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    if (!authData.user) throw new Error('فشل تسجيل الدخول.');

    const { data: user, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authData.user.id)
      .single();

    if (profileError || !user) throw new Error('لم يتم العثور على ملف المستخدم.');

    if (user.status === 'BANNED') {
      await supabase.auth.signOut();
      throw new Error('هذا الحساب محظور.');
    }
    if (user.status !== 'APPROVED') {
      await supabase.auth.signOut();
      throw new Error('هذا الحساب غير مفعل أو قيد المراجعة.');
    }

    return { user };
  },

  logout: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error logging out:', error.message);
        throw error;
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
        return null;
    }

    const { data: user, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', session.user.id)
      .single();
    
    if (profileError || !user) {
      // If a user exists in auth but not in our public users table, sign them out.
      await supabase.auth.signOut();
      return null;
    }
    
    return user;
},

  registerUser: async (data: RegistrationData): Promise<User> => {
    // Sign up the user in Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
    });

    if (signUpError) {
        if (signUpError.message.includes('unique constraint')) {
            throw new Error('البريد الإلكتروني مستخدم بالفعل.');
        }
        throw signUpError;
    }
    if (!authData.user) throw new Error('User registration failed.');

    // Insert the user profile into the public 'users' table
    const { data: newUser, error: profileError } = await supabase
        .from('users')
        .insert({
            auth_user_id: authData.user.id,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            governorate: data.governorate,
            age: data.age,
            role: Role.Trader,
            status: 'PENDING',
        })
        .select()
        .single();
    
    if (profileError) throw profileError;

    // Sign out the user immediately after registration so they can't access protected routes
    // until an admin approves their account.
    await supabase.auth.signOut();
    return newUser;
  },
  
  getProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase.from('products').select('*, category:categoryId(*)');
    if (error) throw error;
    return data || [];
  },

  getProductById: async (id: number): Promise<Product | null> => {
    const { data, error } = await supabase.from('products').select('*, category:categoryId(*)').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  getCategories: async (): Promise<Category[]> => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return data || [];
  },

  getPendingUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase.from('users').select('*').eq('status', 'PENDING');
    if (error) throw error;
    return data || [];
  },
  
  getApprovedTraders: async (): Promise<User[]> => {
    const { data, error } = await supabase.from('users').select('*').eq('role', Role.Trader).eq('status', 'APPROVED');
    if (error) throw error;
    return data || [];
  },

  getBannedUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase.from('users').select('*').eq('status', 'BANNED');
    if (error) throw error;
    return data || [];
  },

  approveUser: async (userId: number): Promise<void> => {
    const { error } = await supabase.from('users').update({ status: 'APPROVED' }).eq('id', userId);
    if (error) throw error;
  },

  rejectUser: async (userId: number): Promise<void> => {
    const { error } = await supabase.from('users').update({ status: 'REJECTED' }).eq('id', userId);
    if (error) throw error;
  },
  
  banUser: async (userId: number): Promise<void> => {
    const { error } = await supabase.from('users').update({ status: 'BANNED' }).eq('id', userId);
    if (error) throw error;
  },

  unbanUser: async (userId: number): Promise<void> => {
    const { error } = await supabase.from('users').update({ status: 'APPROVED' }).eq('id', userId);
    if (error) throw error;
  },
  
  promoteUser: async (userId: number): Promise<void> => {
    const { error } = await supabase.from('users').update({ role: Role.Admin }).eq('id', userId);
    if (error) throw error;
  },

  setAdminNickname: async (userId: number, nickname: string): Promise<void> => {
    const { error } = await supabase.from('users').update({ adminNickname: nickname }).eq('id', userId);
    if (error) throw error;
  },

  // NOTE: Cart logic is kept client-side in localStorage for simplicity.
  getCart: async (): Promise<CartItem[]> => {
      const cartJson = localStorage.getItem('cart');
      return cartJson ? JSON.parse(cartJson) : [];
  },

  addToCart: async (item: CartItem): Promise<CartItem[]> => {
      let cart = await apiService.getCart();
      const existingItem = cart.find(i => i.product.id === item.product.id);
      if (existingItem) {
          existingItem.quantity += item.quantity;
      } else {
          cart.push(item);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      return cart;
  },

  updateCartItemQuantity: async (productId: number, quantity: number): Promise<CartItem[]> => {
      let cart = await apiService.getCart();
      const item = cart.find(i => i.product.id === productId);
      if (item) {
          if (quantity > 0) {
              item.quantity = quantity;
          } else {
              cart = cart.filter(i => i.product.id !== productId);
          }
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      return cart;
  },

  removeFromCart: async (productId: number): Promise<CartItem[]> => {
      let cart = await apiService.getCart();
      cart = cart.filter(i => i.product.id !== productId);
      localStorage.setItem('cart', JSON.stringify(cart));
      return cart;
  },

  checkout: async (customerInfo: CustomerInfo, cart: CartItem[], paymentMethod: PaymentMethod): Promise<Order> => {
      const currentUser = await apiService.getCurrentUser();
      if (!currentUser) throw new Error("User must be logged in to checkout.");

      const totalCost = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const totalRevenue = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
      
      const { data: newOrder, error } = await supabase.from('orders').insert({
          customer: customerInfo,
          items: cart, // Assuming 'items' is a JSONB column
          totalCost,
          totalRevenue,
          netProfit: totalRevenue - totalCost,
          status: OrderStatus.Processing,
          traderId: currentUser.id,
          paymentMethod: paymentMethod,
      }).select().single();
      
      if (error) throw error;

      localStorage.removeItem('cart');
      return newOrder;
  },

  getOrders: async (): Promise<Order[]> => {
    const currentUser = await apiService.getCurrentUser();
    if (!currentUser) return [];

    const { data, error } = await supabase.from('orders').select('*').eq('traderId', currentUser.id).order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  
  getPolicy: async (slug: string): Promise<{ title: string; content: string }> => {
    const policies: { [key: string]: { title: string; content: string } } = {
        'delivery': {
            title: 'سياسة التوصيل',
            content: 'تضمن وصول الطلبات للزبائن في الوقت المحدد (من يوم إلى ثلاثة أيام عمل). سعر التوصيل هو 3,000 دينار لمحافظة بغداد، و 5,000 دينار لباقي المحافظات.'
        },
        'earnings': {
            title: 'سياسة استلام الأرباح',
            content: 'يتم استلام الأرباح عن طريق زين كاش أو ماستر كارد الرافدين. تتم معالجة طلبات السحب خلال 72 ساعة كحد أقصى.'
        },
        'returns': {
            title: 'سياسة الاستبدال والاسترجاع',
            content: 'تتوفر إمكانية استبدال واسترجاع المنتج خلال مدة لا تتجاوز 7 أيام من تاريخ الاستلام، فقط في حال كان يحتوي على مشكلة أو خلل مصنعي.'
        },
        'terms': {
            title: 'شروط الخدمة',
            content: `مرحباً بك في منصة بداية. باستخدامك لهذه المنصة، فإنك توافق على الالتزام بالشروط والأحكام التالية:

1.  **الحسابات:** يجب أن تكون جميع المعلومات المقدمة عند التسجيل دقيقة وحديثة. أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور.
2.  **المنتجات:** يمنع عرض أي منتجات مخالفة للقانون أو السياسات العامة. المنصة لها الحق في إزالة أي منتج تراه غير مناسب.
3.  **الأسعار والأرباح:** يجب على التاجر الالتزام بنطاق الأسعار المحدد للمنتجات. يتم احتساب الأرباح بناءً على سعر البيع المحدد من قبل التاجر مطروحاً منه سعر التكلفة.
4.  **السلوك:** يمنع استخدام المنصة لأي أغراض غير قانونية أو احتيالية. يجب التعامل باحترام مع جميع المستخدمين وفريق الدعم.
5.  **إنهاء الخدمة:** تحتفظ منصة بداية بالحق في تعليق أو إنهاء أي حساب يخالف هذه الشروط دون إشعار مسبق.

نشكر لكم تفهمكم والتزامكم.`
        }
    };
    const policy = policies[slug];
    if (policy) return policy;
    throw new Error('Policy not found');
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const { count: totalTraders, error: tradersError } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', Role.Trader).eq('status', 'APPROVED');
    const { count: totalProducts, error: productsError } = await supabase.from('products').select('*', { count: 'exact', head: true });
    
    if (tradersError || productsError) console.error(tradersError || productsError);
    
    // NOTE: More complex stats are mocked as they would require DB functions (RPC) for efficiency.
    return {
      totalTraders: totalTraders || 0,
      totalProducts: totalProducts || 0,
      monthlyOrders: 432, 
      monthlyEarnings: 15750000,
      traderGrowth: [
        { name: 'يناير', value: 10 }, { name: 'فبراير', value: 15 }, { name: 'مارس', value: 25 },
        { name: 'أبريل', value: 40 }, { name: 'مايو', value: 60 }, { name: 'يونيو', value: 120 },
      ],
      salesPerformance: [
        { name: 'الأسبوع 1', value: 2400000 }, { name: 'الأسبوع 2', value: 1398000 },
        { name: 'الأسبوع 3', value: 9800000 }, { name: 'الأسبوع 4', value: 3908000 },
      ],
    };
  },

  deleteProduct: async (productId: number): Promise<void> => {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) throw error;
  },

  saveProduct: async (product: Partial<Product>): Promise<Product> => {
    const { data, error } = await supabase.from('products').upsert(product).select().single();
    if (error) throw error;
    return data;
  },
};
