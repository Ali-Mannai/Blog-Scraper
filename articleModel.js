const mongoose = require('mongoose');

// Schéma de données pour un article
const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    link: { type: String, required: true, unique: true },
    imageURL: String,
    description: String,
    date: { type: String, required: true },
    author: { type: String, required: true },
    category: String,
    tags: [String],
    likes: { type: Number, default: () => Math.floor(Math.random() * 1000) },
    vues: { type: Number, default: () => Math.floor(Math.random() * 1000) },
    interactions: { type: Number, default: () => Math.floor(Math.random() * 1000) },
});

// Création du modèle Article
const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
