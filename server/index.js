// Lokasi: server/index.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// === KONFIGURASI DATABASE ===
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_tokobuku' 
});

db.connect((err) => {
    if (err) {
        console.error('Gagal koneksi ke database:', err);
    } else {
        console.log('Berhasil terhubung ke database: db_tokobuku');
    }
});

// === API ENDPOINTS ===

// 1. API Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) {
            const user = result[0];
            delete user.password; // Jangan kirim password ke frontend
            return res.json({ success: true, user: user });
        } else {
            return res.json({ success: false, message: "Username atau Password Salah" });
        }
    });
});

// 2. API Register (Daftar Akun Baru)
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    // Cek dulu apakah username/email sudah ada
    const checkSql = "SELECT * FROM users WHERE username = ? OR email = ?";
    db.query(checkSql, [username, email], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) {
            return res.json({ success: false, message: "Username atau Email sudah terdaftar!" });
        }

        // Jika aman, masukkan ke database
        const insertSql = "INSERT INTO users (username, email, password, role, name) VALUES (?, ?, ?, 'user', ?)";
        // Kita set 'name' sama dengan username sebagai default
        db.query(insertSql, [username, email, password, username], (err, result) => {
            if (err) return res.status(500).json(err);
            return res.json({ success: true, message: "Registrasi berhasil!" });
        });
    });
});

// 3. API Ambil Semua Buku
app.get('/api/books', (req, res) => {
    const sql = "SELECT * FROM books";
    db.query(sql, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
});

// 4. API Ambil Satu Buku (Detail)
app.get('/api/books/:id', (req, res) => {
    const bookId = req.params.id;
    const sql = "SELECT * FROM books WHERE id = ?";
    db.query(sql, [bookId], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) {
            return res.json(result[0]);
        } else {
            return res.status(404).json({ message: "Buku tidak ditemukan" });
        }
    });
});

// ... kode API register/login/books sebelumnya ...

// API 5: Buat Pesanan Baru (Checkout)
app.post('/api/orders', (req, res) => {
    const { userId, items, totalAmount, shippingAddress, paymentMethod } = req.body;

    // 1. Validasi sederhana
    if (!userId || !items || items.length === 0) {
        return res.status(400).json({ success: false, message: "Data pesanan tidak lengkap" });
    }

    // 2. Simpan ke tabel 'orders'
    const orderSql = "INSERT INTO orders (user_id, total_amount, shipping_address, payment_method, status) VALUES (?, ?, ?, ?, 'pending')";
    
    db.query(orderSql, [userId, totalAmount, shippingAddress, paymentMethod], (err, result) => {
        if (err) {
            console.error("Error creating order:", err);
            return res.status(500).json({ success: false, message: "Gagal membuat pesanan" });
        }

        const orderId = result.insertId; // Ambil ID pesanan yang baru dibuat

        // 3. Simpan detail barang ke tabel 'order_items'
        // Kita loop setiap item dan masukkan ke DB
        const orderItemsValues = items.map(item => [orderId, item.id, item.quantity, item.price]);
        const itemsSql = "INSERT INTO order_items (order_id, book_id, quantity, price) VALUES ?";

        db.query(itemsSql, [orderItemsValues], (err, result) => {
            if (err) {
                console.error("Error creating order items:", err);
                return res.status(500).json({ success: false, message: "Gagal menyimpan detail item" });
            }

            return res.json({ 
                success: true, 
                message: "Pesanan berhasil dibuat!", 
                orderId: orderId 
            });
        });
    });
});


// API 6: Simulasi Pembayaran Berhasil (Update Status)
app.post('/api/orders/:id/pay', (req, res) => {
    const orderId = req.params.id;
    const sql = "UPDATE orders SET status = 'paid' WHERE id = ?";
    
    db.query(sql, [orderId], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ success: true, message: "Pembayaran berhasil!" });
    });
});

// API 7: Ambil Riwayat Pesanan User
app.get('/api/orders/user/:userId', (req, res) => {
    const userId = req.params.userId;
    // Kita join agar bisa lihat detail berapa item yang dibeli (opsional)
    const sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
    
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result);
    });
});

// API 8: Ambil Detail Satu Order (Untuk Halaman Invoice & Success)
app.get('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;

    // 1. Ambil Data Utama Order
    const sqlOrder = "SELECT * FROM orders WHERE id = ?";
    
    // 2. Ambil Detail Item Buku
    const sqlItems = `
        SELECT oi.*, b.title, b.image, b.author 
        FROM order_items oi 
        JOIN books b ON oi.book_id = b.id 
        WHERE oi.order_id = ?
    `;

    db.query(sqlOrder, [orderId], (err, orderResult) => {
        if (err) return res.status(500).json(err);
        if (orderResult.length === 0) return res.status(404).json({ message: "Order not found" });

        const order = orderResult[0];

        // Ambil item bukunya
        db.query(sqlItems, [orderId], (err, itemsResult) => {
            if (err) return res.status(500).json(err);
            
            // Gabungkan data
            order.items = itemsResult;
            res.json(order);
        });
    });
});

// API 9: Ambil Statistik Dashboard (Total Penjualan, Order, Buku, User)
app.get('/api/admin/stats', (req, res) => {
    // Kita gunakan Promise.all agar query jalan paralel (lebih cepat)
    const qSales = new Promise((resolve, reject) => {
        db.query("SELECT SUM(total_amount) as total FROM orders WHERE status = 'paid'", (err, res) => {
            if (err) reject(err); else resolve(res[0].total || 0);
        });
    });

    const qOrders = new Promise((resolve, reject) => {
        db.query("SELECT COUNT(*) as count FROM orders", (err, res) => {
            if (err) reject(err); else resolve(res[0].count || 0);
        });
    });

    const qBooks = new Promise((resolve, reject) => {
        db.query("SELECT COUNT(*) as count FROM books", (err, res) => {
            if (err) reject(err); else resolve(res[0].count || 0);
        });
    });

    const qUsers = new Promise((resolve, reject) => {
        db.query("SELECT COUNT(*) as count FROM users WHERE role = 'user'", (err, res) => {
            if (err) reject(err); else resolve(res[0].count || 0);
        });
    });

    Promise.all([qSales, qOrders, qBooks, qUsers])
        .then(([sales, orders, books, users]) => {
            res.json({
                totalSales: sales,
                totalOrders: orders,
                totalBooks: books,
                totalUsers: users
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Gagal mengambil data statistik" });
        });
});

// API 10: Ambil Pesanan Terbaru (Untuk Tabel di Dashboard)
app.get('/api/admin/recent-orders', (req, res) => {
    // Ambil 5 pesanan terakhir beserta nama user
    const sql = `
        SELECT o.id, o.total_amount, o.status, o.created_at, u.name as user_name 
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 5
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// API 11: Tambah Buku Baru
app.post('/api/books', (req, res) => {
    const { title, author, price, category, image, description, rating, discount } = req.body;
    const sql = "INSERT INTO books (title, author, price, category, image, description, rating, discount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    // Default rating 4.5 dan discount 0 jika kosong
    const values = [title, author, price, category, image, description, rating || 4.5, discount || 0];
    
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Gagal menambah buku" });
        }
        res.json({ success: true, message: "Buku berhasil ditambahkan", id: result.insertId });
    });
});

// API 12: Edit Buku
app.put('/api/books/:id', (req, res) => {
    const id = req.params.id;
    const { title, author, price, category, image, description, rating, discount } = req.body;
    const sql = "UPDATE books SET title=?, author=?, price=?, category=?, image=?, description=?, rating=?, discount=? WHERE id=?";
    
    const values = [title, author, price, category, image, description, rating, discount, id];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Gagal update buku" });
        res.json({ success: true, message: "Buku berhasil diperbarui" });
    });
});

// API 13: Hapus Buku
app.delete('/api/books/:id', (req, res) => {
    const id = req.params.id;
    
    // Cek dulu apakah buku sudah pernah dibeli (ada di order_items)
    // Jika ya, sebaiknya jangan dihapus permanen (atau handle error foreign key)
    const sql = "DELETE FROM books WHERE id=?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            // Error biasanya karena buku ini ada di riwayat pesanan user (Foreign Key Constraint)
            return res.status(500).json({ success: false, message: "Gagal menghapus (Mungkin buku ini ada dalam riwayat pesanan)" });
        }
        res.json({ success: true, message: "Buku berhasil dihapus" });
    });
});

// API 14: Ambil Semua Pesanan (Lengkap dengan nama customer)
app.get('/api/admin/orders', (req, res) => {
    const sql = `
        SELECT o.*, u.name as customer_name, u.email 
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// API 15: Update Status Pesanan
app.put('/api/admin/orders/:id/status', (req, res) => {
    const { status } = req.body; // Status baru: 'shipped', 'delivered', 'cancelled', dll
    const { id } = req.params;
    
    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Gagal update status" });
        res.json({ success: true, message: `Status pesanan #${id} berhasil diubah menjadi ${status}` });
    });
});

// API 16: Ambil Daftar Invoice (Hanya pesanan Valid: Paid/Shipped/Delivered)
app.get('/api/admin/invoices', (req, res) => {
    const sql = `
        SELECT o.*, u.name as customer_name, u.email 
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.status IN ('paid', 'shipped', 'delivered')
        ORDER BY o.created_at DESC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// API 17: Ambil Riwayat Pembelian (Kulakan)
app.get('/api/admin/purchases', (req, res) => {
    const sql = "SELECT * FROM purchases ORDER BY created_at DESC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// API 18: Catat Pembelian Baru (Restock) & Update Stok Buku
app.post('/api/admin/purchases', (req, res) => {
    const { supplier, items } = req.body; // items = [{bookId, qty, cost}, ...]

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "Tidak ada barang yang dibeli" });
    }

    // Hitung total
    let totalItems = 0;
    let totalCost = 0;
    items.forEach(item => {
        totalItems += parseInt(item.qty);
        totalCost += parseInt(item.qty) * parseFloat(item.cost);
    });

    // 1. Simpan ke tabel 'purchases'
    const sqlPurchase = "INSERT INTO purchases (supplier_name, total_items, total_cost) VALUES (?, ?, ?)";
    
    db.query(sqlPurchase, [supplier, totalItems, totalCost], (err, result) => {
        if (err) return res.status(500).json(err);
        
        const purchaseId = result.insertId;

        // 2. Simpan detail ke 'purchase_items' DAN Update Stok di tabel 'books'
        const itemValues = items.map(i => [purchaseId, i.bookId, i.qty, i.cost]);
        const sqlItems = "INSERT INTO purchase_items (purchase_id, book_id, quantity, cost_price) VALUES ?";
        
        db.query(sqlItems, [itemValues], (err) => {
            if (err) return res.status(500).json(err);

            // 3. Update stok buku satu per satu (Looping query)
            // Catatan: Untuk skala besar, sebaiknya pakai transaction / bulk update logic
            items.forEach(item => {
                db.query("UPDATE books SET stock = stock + ? WHERE id = ?", [item.qty, item.bookId]);
            });

            res.json({ success: true, message: "Stok berhasil ditambahkan!" });
        });
    });
});

// API 19: Ambil Wishlist User
app.get('/api/wishlist/:userId', (req, res) => {
    const userId = req.params.userId;
    // Join dengan tabel books agar kita dapat detail bukunya langsung
    const sql = `
        SELECT w.book_id, b.* FROM wishlist w 
        JOIN books b ON w.book_id = b.id 
        WHERE w.user_id = ?
        ORDER BY w.created_at DESC
    `;
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// API 20: Tambah ke Wishlist
app.post('/api/wishlist', (req, res) => {
    const { userId, bookId } = req.body;
    const sql = "INSERT INTO wishlist (user_id, book_id) VALUES (?, ?)";
    
    db.query(sql, [userId, bookId], (err, result) => {
        if (err) {
            // Jika error duplikat (sudah ada), kita anggap sukses saja
            if (err.code === 'ER_DUP_ENTRY') {
                return res.json({ success: true, message: "Buku sudah ada di wishlist" });
            }
            return res.status(500).json({ success: false, message: "Gagal menambah wishlist" });
        }
        res.json({ success: true, message: "Berhasil ditambahkan ke wishlist" });
    });
});

// API 21: Hapus dari Wishlist
app.delete('/api/wishlist/:userId/:bookId', (req, res) => {
    const { userId, bookId } = req.params;
    const sql = "DELETE FROM wishlist WHERE user_id = ? AND book_id = ?";
    
    db.query(sql, [userId, bookId], (err, result) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, message: "Dihapus dari wishlist" });
    });
});

// API 22: Ambil Ulasan per Buku
app.get('/api/books/:id/reviews', (req, res) => {
    const bookId = req.params.id;
    const sql = `
        SELECT r.*, u.name as user_name 
        FROM reviews r 
        JOIN users u ON r.user_id = u.id 
        WHERE r.book_id = ? 
        ORDER BY r.created_at DESC
    `;
    db.query(sql, [bookId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// API 23: Kirim Ulasan Baru & Update Rating Buku
app.post('/api/reviews', (req, res) => {
    const { userId, bookId, rating, comment } = req.body;
    
    // 1. Masukkan Review ke tabel reviews
    const insertSql = "INSERT INTO reviews (user_id, book_id, rating, comment) VALUES (?, ?, ?, ?)";
    
    db.query(insertSql, [userId, bookId, rating, comment], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Gagal kirim ulasan" });

        // 2. Hitung Rata-rata Rating Baru untuk buku ini
        const avgSql = "SELECT AVG(rating) as average FROM reviews WHERE book_id = ?";
        
        db.query(avgSql, [bookId], (err, avgResult) => {
            if (err) return res.json({ success: true }); // Kalau gagal hitung, tetap return success review

            const newRating = avgResult[0].average || rating; // Fallback ke rating saat ini

            // 3. Update kolom 'rating' di tabel books
            const updateBookSql = "UPDATE books SET rating = ? WHERE id = ?";
            db.query(updateBookSql, [newRating, bookId], () => {
                // Abaikan error update rating, yang penting review masuk
                res.json({ success: true, message: "Ulasan berhasil dikirim!" });
            });
        });
    });
});

// Jalankan Server
app.listen(3001, () => {
    console.log("Server berjalan di port 3001");
});