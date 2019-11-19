// =============================
//  Puerto
// =============================
process.env.PORT = process.env.PORT || 3000;

// =============================
//  Entorno
// =============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =============================
//  Vencimiento de token
// =============================
// 60
// 60
// 24
// 30
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// =============================
//  SEED de aunteticacion
// =============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// =============================
//  Base de Datos
// =============================
let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// =============================
//  Google client ID
// =============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '780445180043-20tcnua4dsmect02du0ipsuipvktief0.apps.googleusercontent.com';