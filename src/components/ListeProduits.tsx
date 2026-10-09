import { useEffect, useState } from 'react';

interface Produit {
    id: number;
    nom: string;
    prix: number;
    stock: number;
    categorie: string;
}

function ListeProduits() {
    const [produits, setProduits] = useState<Produit[]>([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState('');

    useEffect(() => {
        let annule = false;

        async function chargerProduits() {
            try {
                const reponse = await fetch(
                    'http://localhost:3000/api/produits'
                );

                if (!reponse.ok) {
                    throw new Error('Erreur lors du chargement des produits');
                }

                const donnees: Produit[] = await reponse.json();

                if (!annule) {
                    setProduits(donnees);
                    setChargement(false);
                }
            } catch (e) {
                if (!annule) {
                    setErreur(
                        e instanceof Error ? e.message : 'Erreur inconnue'
                    );
                    setChargement(false);
                }
            }
        }

        chargerProduits();

        return () => {
            annule = true;
        };
    }, []);

    if (chargement) {
        return <p>Chargement des produits...</p>;
    }

    if (erreur) {
        return <p role="alert">Erreur : {erreur}</p>;
    }

    return (
        <div>
            <h2>Produits de mon API</h2>

            <ul>
                {produits.map((produit) => (
                    <li key={produit.id}>
                        <strong>{produit.nom}</strong>
                        {' — Prix : '}
                        {produit.prix.toFixed(2)} $
                        {' — Stock : '}
                        {produit.stock}
                        {' — Catégorie : '}
                        {produit.categorie}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListeProduits;
