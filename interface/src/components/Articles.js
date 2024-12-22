import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        likesCount: 10,
        sortBy: '',
        sortByViews: '',
        sortByInteractions: ''
    });

    const cleanHTML = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    useEffect(() => {
        axios.get('http://localhost:3000/articles')
            .then((response) => {
                const cleanedArticles = response.data.map(article => ({
                    ...article,
                    author: cleanHTML(article.author),
                    likes: Math.floor(Math.random() * 1000),
                    vues: Math.floor(Math.random() * 1000),
                    interactions: Math.floor(Math.random() * 1000),
                }));
                setArticles(cleanedArticles);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des articles:', error);
                setLoading(false);
            });
    }, []);

    const applyFilters = () => {
        let filteredArticles = [...articles];

        // Trier par likes
        if (filter.sortBy === 'mostLiked') {
            filteredArticles.sort((a, b) => b.likes - a.likes);
        } else if (filter.sortBy === 'leastLiked') {
            filteredArticles.sort((a, b) => a.likes - b.likes);
        }

        // Trier par vues
        if (filter.sortByViews === 'mostViewed') {
            filteredArticles.sort((a, b) => b.vues - a.vues);
        } else if (filter.sortByViews === 'leastViewed') {
            filteredArticles.sort((a, b) => a.vues - b.vues);
        }

        // Trier par interactions
        if (filter.sortByInteractions === 'mostInteracted') {
            filteredArticles.sort((a, b) => b.interactions - a.interactions);
        } else if (filter.sortByInteractions === 'leastInteracted') {
            filteredArticles.sort((a, b) => a.interactions - b.interactions);
        }

        // Limiter le nombre d'articles affichés selon `likesCount`
        filteredArticles = filteredArticles.slice(0, filter.likesCount);

        return filteredArticles;
    };

    if (loading) {
        return <div className="text-center text-lg font-semibold">Chargement des articles...</div>;
    }

    if (articles.length === 0) {
        return <div className="text-center text-lg font-semibold">Aucun article disponible.</div>;
    }

    const filteredArticles = applyFilters();

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-4xl font-bold text-center mb-6">Liste des Articles</h1>

            {/* Section des Filtres */}
            <div className="bg-gray-100 p-4 mb-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-black">Les requêtes à exécuter</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Trier par Likes */}
                    <div>
                        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">
                            Trier par Likes
                        </label>
                        <select
                            id="sortBy"
                            value={filter.sortBy}
                            onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })}
                            className="mt-1 p-2 block w-full border rounded-lg text-black">
                            <option value="">-- Sélectionner --</option>
                            <option value="mostLiked">Les plus likés</option>
                            <option value="leastLiked">Les moins likés</option>
                        </select>
                    </div>

                    {/* Trier par Vues */}
                    <div>
                        <label htmlFor="sortByViews" className="block text-sm font-medium text-gray-700">
                            Trier par Vues
                        </label>
                        <select
                            id="sortByViews"
                            value={filter.sortByViews}
                            onChange={(e) => setFilter({ ...filter, sortByViews: e.target.value })}
                            className="mt-1 p-2 block w-full border rounded-lg text-black">
                            <option value="">-- Sélectionner --</option>
                            <option value="mostViewed">Les plus vues</option>
                            <option value="leastViewed">Les moins vues</option>
                        </select>
                    </div>

                    {/* Trier par Interactions */}
                    <div>
                        <label htmlFor="sortByInteractions" className="block text-sm font-medium text-gray-700">
                            Trier par Interactions
                        </label>
                        <select
                            id="sortByInteractions"
                            value={filter.sortByInteractions}
                            onChange={(e) => setFilter({ ...filter, sortByInteractions: e.target.value })}
                            className="mt-1 p-2 block w-full border rounded-lg text-black">
                            <option value="">-- Sélectionner --</option>
                            <option value="mostInteracted">Les plus interagis</option>
                            <option value="leastInteracted">Les moins interagis</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Liste des articles filtrés */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                    <div key={article.link} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">{article.title}</h2>
                        <p className="text-gray-700 mb-4">{article.description}</p>
                        <p className="text-gray-500 text-sm">Par {article.author}</p>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">Likes: {article.likes}</span>
                            <span className="text-sm text-gray-500 ml-4">Vues: {article.vues}</span>
                            <span className="text-sm text-gray-500 ml-4">Interactions: {article.interactions}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Articles;
