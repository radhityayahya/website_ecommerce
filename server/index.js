const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer'); // Library untuk upload
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Agar folder 'uploads' bisa diakses publik (untuk menampilkan gambar di frontend)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === DATABASE CONNECTION ===
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_tokobuku'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to MySQL Database');
    }
});

// === KONFIGURASI UPLOAD GAMBAR (MULTER) ===
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        // Cek apakah folder ada, jika tidak buat baru
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Nama file: timestamp-namaasli (untuk menghindari duplikat)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. API UPLOAD GAMBAR
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Tidak ada file yang diupload" });
    }
    // URL Gambar yang bisa diakses dari frontend
    const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
    res.json({ success: true, url: imageUrl });
});

// 2. AUTHENTICATION (LOGIN & REGISTER)
app.post('/api/register', (req, res) => {
    const { name, username, email, password, role } = req.body;
    const userRole = role || 'user'; // Default role user
    const sql = "INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, username, email, password, userRole], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true, message: "Registrasi berhasil!" });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length > 0) {
            const user = data[0];
            // Hapus password dari respons agar aman
            const { password, ...userData } = user;
            return res.json({ success: true, message: "Login berhasil", user: userData });
        } else {
            return res.status(401).json({ success: false, message: "Username atau password salah" });
        }
    });
});

// 3. PRODUCT MANAGEMENT (BUKU)
// Ambil Semua Buku
app.get('/api/books', (req, res) => {
    const sql = "SELECT * FROM books";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

// Ambil Detail Buku
app.get('/api/books/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM books WHERE id = ?";
    db.query(sql, [id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ message: "Buku tidak ditemukan" });
        res.json(data[0]);
    });
});

// Tambah Buku Baru (Admin)
app.post('/api/books', (req, res) => {
    const { title, author, price, category, image, description, rating, discount } = req.body;
    const sql = "INSERT INTO books (title, author, price, category, image, description, rating, discount, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [title, author, price, category, image, description, rating || 4.5, discount || 0, 50]; // Default stock 50
    
    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Gagal menambah buku" });
        res.json({ success: true, message: "Buku berhasil ditambahkan", id: result.insertId });
    });
});

// Edit Buku (Admin)
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

// Hapus Buku (Admin)
app.delete('/api/books/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM books WHERE id=?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Gagal menghapus (Mungkin buku ada di riwayat pesanan)" });
        res.json({ success: true, message: "Buku berhasil dihapus" });
    });
});

// 4. ORDER & TRANSAKSI
// Buat Pesanan Baru (Checkout)
app.post('/api/orders', (req, res) => {
    const { userId, items, total, paymentMethod } = req.body;
    
    // 1. Simpan ke tabel 'orders'
    const sqlOrder = "INSERT INTO orders (user_id, total_amount, status, payment_method) VALUES (?, ?, 'pending', ?)";
    
    db.query(sqlOrder, [userId, total, paymentMethod], (err, result) => {
        if (err) return res.status(500).json(err);
        
        const orderId = result.insertId;
        
        // 2. Simpan item ke tabel 'order_items'
        const orderItems = items.map(item => [orderId, item.id, item.quantity, item.price]);
        const sqlItems = "INSERT INTO order_items (order_id, book_id, quantity, price) VALUES ?";
        
        db.query(sqlItems, [orderItems], (err, resultItems) => {
            if (err) return res.status(500).json(err);
            res.json({ success: true, orderId });
        });
    });
});

// Ambil Detail Pesanan
app.get('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;
    
    const sqlOrder = "SELECT * FROM orders WHERE id = ?";
    const sqlItems = `
        SELECT oi.*, b.title, b.author, b.image 
        FROM order_items oi 
        JOIN books b ON oi.book_id = b.id 
        WHERE oi.order_id = ?
    `;

    db.query(sqlOrder, [orderId], (err, orderResult) => {
        if (err || orderResult.length === 0) return res.status(404).json({ message: "Order not found" });
        
        db.query(sqlItems, [orderId], (err, itemsResult) => {
            if (err) return res.status(500).json(err);
            res.json({ ...orderResult[0], items: itemsResult });
        });
    });
});

// Ambil Riwayat Pesanan User
app.get('/api/orders/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// Update Status Pesanan (Setelah Bayar / Admin Update)
app.put('/api/orders/:id/pay', (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body; // 'paid'
    
    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    db.query(sql, [status, orderId], (err, result) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

// 5. ADMIN FEATURES
// Statistik Dashboard
app.get('/api/admin/stats', (req, res) => {
    const qSales = new Promise((resolve, reject) => {
        db.query("SELECT SUM(total_amount) as total FROM orders WHERE status = 'paid'", (err, res) => err ? reject(err) : resolve(res[0].total || 0));
    });
    const qOrders = new Promise((resolve, reject) => {
        db.query("SELECT COUNT(*) as count FROM orders", (err, res) => err ? reject(err) : resolve(res[0].count || 0));
    });
    const qBooks = new Promise((resolve, reject) => {
        db.query("SELECT COUNT(*) as count FROM books", (err, res) => err ? reject(err) : resolve(res[0].count || 0));
    });
    const qUsers = new Promise((resolve, reject) => {
        db.query("SELECT COUNT(*) as count FROM users WHERE role = 'user'", (err, res) => err ? reject(err) : resolve(res[0].count || 0));
    });

    Promise.all([qSales, qOrders, qBooks, qUsers])
        .then(([sales, orders, books, users]) => {
            res.json({ totalSales: sales, totalOrders: orders, totalBooks: books, totalUsers: users });
        })
        .catch(err => res.status(500).json({ message: "Error fetching stats" }));
});

// Pesanan Terbaru (Dashboard)
app.get('/api/admin/recent-orders', (req, res) => {
    const sql = `
        SELECT o.id, o.total_amount, o.status, o.created_at, u.name as user_name 
        FROM orders o JOIN users u ON o.user_id = u.id 
        ORDER BY o.created_at DESC LIMIT 5
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// Semua Pesanan (Sales History Page)
app.get('/api/admin/orders', (req, res) => {
    const sql = `
        SELECT o.*, u.name as customer_name, u.email 
        FROM orders o JOIN users u ON o.user_id = u.id 
        ORDER BY o.created_at DESC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// Update Status Pesanan (Admin)
app.put('/api/admin/orders/:id/status', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, message: `Status updated to ${status}` });
    });
});

// Invoices (Hanya yang Valid)
app.get('/api/admin/invoices', (req, res) => {
    const sql = `
        SELECT o.*, u.name as customer_name, u.email 
        FROM orders o JOIN users u ON o.user_id = u.id 
        WHERE o.status IN ('paid', 'shipped', 'delivered') 
        ORDER BY o.created_at DESC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// Inventory: Riwayat Pembelian
app.get('/api/admin/purchases', (req, res) => {
    const sql = "SELECT * FROM purchases ORDER BY created_at DESC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// Inventory: Restock
app.post('/api/admin/purchases', (req, res) => {
    const { supplier, items } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: "No items" });

    let totalItems = 0;
    let totalCost = 0;
    items.forEach(item => {
        totalItems += parseInt(item.qty);
        totalCost += parseInt(item.qty) * parseFloat(item.cost);
    });

    const sqlPurchase = "INSERT INTO purchases (supplier_name, total_items, total_cost) VALUES (?, ?, ?)";
    db.query(sqlPurchase, [supplier, totalItems, totalCost], (err, result) => {
        if (err) return res.status(500).json(err);
        const purchaseId = result.insertId;
        const itemValues = items.map(i => [purchaseId, i.bookId, i.qty, i.cost]);
        const sqlItems = "INSERT INTO purchase_items (purchase_id, book_id, quantity, cost_price) VALUES ?";
        
        db.query(sqlItems, [itemValues], (err) => {
            if (err) return res.status(500).json(err);
            // Update stock buku
            items.forEach(item => {
                db.query("UPDATE books SET stock = stock + ? WHERE id = ?", [item.qty, item.bookId]);
            });
            res.json({ success: true, message: "Stok berhasil ditambahkan!" });
        });
    });
});

// 6. WISHLIST
app.get('/api/wishlist/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = "SELECT w.book_id, b.* FROM wishlist w JOIN books b ON w.book_id = b.id WHERE w.user_id = ? ORDER BY w.created_at DESC";
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.post('/api/wishlist', (req, res) => {
    const { userId, bookId } = req.body;
    const sql = "INSERT INTO wishlist (user_id, book_id) VALUES (?, ?)";
    db.query(sql, [userId, bookId], (err, result) => {
        if (err && err.code === 'ER_DUP_ENTRY') return res.json({ success: true });
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

app.delete('/api/wishlist/:userId/:bookId', (req, res) => {
    const { userId, bookId } = req.params;
    const sql = "DELETE FROM wishlist WHERE user_id = ? AND book_id = ?";
    db.query(sql, [userId, bookId], (err, result) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

// 7. REVIEWS
app.get('/api/books/:id/reviews', (req, res) => {
    const bookId = req.params.id;
    const sql = "SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.book_id = ? ORDER BY r.created_at DESC";
    db.query(sql, [bookId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.post('/api/reviews', (req, res) => {
    const { userId, bookId, rating, comment } = req.body;
    const insertSql = "INSERT INTO reviews (user_id, book_id, rating, comment) VALUES (?, ?, ?, ?)";
    db.query(insertSql, [userId, bookId, rating, comment], (err, result) => {
        if (err) return res.status(500).json({ success: false });
        // Update rating rata-rata buku
        const avgSql = "SELECT AVG(rating) as average FROM reviews WHERE book_id = ?";
        db.query(avgSql, [bookId], (err, avgResult) => {
            if (!err) {
                const newRating = avgResult[0].average || rating;
                db.query("UPDATE books SET rating = ? WHERE id = ?", [newRating, bookId]);
            }
            res.json({ success: true, message: "Review added" });
        });
    });
});

app.put('/api/users/:id/password', (req, res) => {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    // 1. Cek apakah password lama benar
    const checkSql = "SELECT * FROM users WHERE id = ? AND password = ?";
    db.query(checkSql, [userId, currentPassword], (err, data) => {
        if (err) return res.status(500).json(err);
        
        if (data.length === 0) {
            return res.status(401).json({ success: false, message: "Password saat ini salah!" });
        }

        // 2. Jika benar, update password baru
        const updateSql = "UPDATE users SET password = ? WHERE id = ?";
        db.query(updateSql, [newPassword, userId], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ success: true, message: "Password berhasil diubah!" });
        });
    });
});

app.put('/api/users/:id/avatar', upload.single('image'), (req, res) => {
    const userId = req.params.id;
    
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Tidak ada file yang diupload" });
    }

    // Buat URL gambar
    const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;

    const sql = "UPDATE users SET image = ? WHERE id = ?";
    db.query(sql, [imageUrl, userId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true, message: "Foto profil berhasil diupdate", image: imageUrl });
    });
});

// START SERVER
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});