const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const axios = require('axios');
const cheerio = require('cheerio');
const Article = require('./articleModel');

const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());


// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/labiotech').then(() => {
    console.log("Connexion à MongoDB réussie !");
}).catch(err => {
    console.error("Erreur de connexion à MongoDB :", err);
});

// Middleware pour gérer les erreurs de JSON
app.use(express.json());

// Route pour récupérer les articles
app.get('/articles', async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error);
        res.status(500).send("Erreur lors de la récupération des articles.");
    }
});

// Fonction pour extraire les articles depuis le site
const extraireArticles = async () => {
    console.log("Extraction des articles...");
    for (let i = 1; i <= 20; i++) {
        const url = `https://www.labiotech.eu/page/${i}`;
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            $('article').each(async (_, element) => {
                try {
                    const title = $(element).find('h2 a').text().trim();
                    const link = $(element).find('h2 a').attr('href');
                    const description = $(element)
                        .find('.text-l-textgrey.text-base.mb-2.line-clamp-3')
                        .text()
                        .trim();
                    
                    const author = $(element)
                        .find('a[href*="author"]')
                        .text()
                        .replace('By ', '')
                        .trim() || 'Auteur non mentionné';
                    
                    const date = $(element).find('.entry-header .text-l-textgrey').text().trim();
                    const imageURL = $(element).find('img').attr('src');

                    console.log(`Extraction: ${title} - ${author}`);

                    const existant = await Article.findOne({ link });
                    if (!existant) {
                        const likes = Math.floor(Math.random() * 1000);
                        const vues = Math.floor(Math.random() * 1000);
                        const interactions = Math.floor(Math.random() * 1000);

                        await Article.create({ title, link, imageURL, description, date, author, likes, vues, interactions });
                        console.log(`Article ajouté : ${title}`);
                    }
                } catch (innerError) {
                    console.error(`Erreur lors de l'extraction d'un article :`, innerError.message);
                }
            });
        } catch (error) {
            console.error(`Erreur lors de l'extraction depuis ${url}:`, error.message);
        }
    }
};

// Fonction pour extraire les articles depuis Medium
const extraireArticlesMedium = async () => {
    console.log("Extraction des articles depuis Medium...");
    for (let i = 1; i <= 5; i++) { // Limite de pages à 5 pour la démonstration
        const url = `https://medium.com/page/${i}`;
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            $('article').each(async (_, element) => {
                try {
                    const title = $(element).find('h2').text().trim();
                    const link = $(element).find('a').attr('href');
                    const description = $(element).find('p').text().trim();
                    
                    const author = $(element).find('.ds-link').text().trim() || 'Auteur non mentionné';
                    
                    const date = new Date().toLocaleDateString(); // Utilisation de la date actuelle comme placeholder
                    const imageURL = $(element).find('img').attr('src');

                    console.log(`Extraction: ${title} - ${author}`);

                    const existant = await Article.findOne({ link });
                    if (!existant) {
                        const likes = Math.floor(Math.random() * 1000);
                        const vues = Math.floor(Math.random() * 1000);
                        const interactions = Math.floor(Math.random() * 1000);

                        await Article.create({ title, link, imageURL, description, date, author, likes, vues, interactions });
                        console.log(`Article ajouté depuis Medium : ${title}`);
                    }
                } catch (innerError) {
                    console.error(`Erreur lors de l'extraction d'un article depuis Medium :`, innerError.message);
                }
            });
        } catch (error) {
            console.error(`Erreur lors de l'extraction depuis Medium ${url}:`, error.message);
        }
    }
};

// Planifier l'extraction des articles de Labiotech et Medium tous les jours à 9h
cron.schedule('0 9 * * *', () => {
    extraireArticles();  // Extraction depuis Labiotech
    extraireArticlesMedium();  // Extraction depuis Medium
});

// Exécution immédiate au démarrage
extraireArticles();
extraireArticlesMedium();


// Démarrer le serveur Express
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});
