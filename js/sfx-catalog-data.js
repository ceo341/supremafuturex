/**
 * SUPREMA FUTURE X // MASTER CATALOG DATA
 * Governance: Giuliano CEO
 * Assets: Pomelli Opal & Linea Antigravity
 */

window.SFX_CATALOG = {
    products: {
        opal_knobs: {
            id: "OPAL-SFX-2026-PAT",
            name: "Pomelli Opal Luxury",
            category: "Luxury Fittings & Interior",
            tagline: "Finiture Sartoriali in Oro 24K e Castoni in Opale Nobile",
            description: "Esclusiva linea di pomelli d'arredo per yacht, dimore d'élite e suite executive. Lavorazione artigianale con dettagli in Ciano Sovrano e Oro Imperiale.",
            media: "media/boutique-luxury png.png",
            pointsBonus: 500,
            statusRequired: "GRADO 2 // SILVER EXECUTIVE",
            specs: {
                materials: "Ottone massiccio placcato Oro 24K, Opale Nobile incastonato",
                compatibility: "Standard universale luxury fittings (32mm - 64mm)",
                warranty: "Certificato EAL6+ con ologramma di autenticità"
            },
            targetActions: ["RICHIEDI_CAMPIONARIO", "ORDINE_LUXURY_OPAL"]
        },
        antigravity_line: {
            id: "ANTIG-SFX-2026-X",
            name: "Linea Antigravity Innovation",
            category: "Advanced Technology & Design",
            tagline: "Sospensione Magnetica Neurale ad Alta Frequenza",
            description: "Sistema di levitazione e stabilità per ambienti direzionali e showroom VIP. Design avveniristico integrato con l'Ecosistema Neurale Suprema.",
            media: "media/alison-lifestyle.png",
            pointsBonus: 1000,
            statusRequired: "GRADO 3 // GOLD MEMBER",
            specs: {
                technology: "Campo ad induzione magnetica costante con regolazione dinamica",
                power: "Alimentazione stealth a basso consumo, standby automatico",
                finish: "Finitura Bianco Perlato, bordi glowing Ciano/Oro"
            },
            targetActions: ["CANDIDATURA_ANTIGRAVITY", "DEMO_SHOWROOM"]
        }
    },

    // Helper per ottenere dettagli prodotto
    getProduct: function(key) {
        return this.products[key] || null;
    },

    // Calcolo accredito punti sulla Gold Card
    calcolaAccredito: function(productId, importoEur) {
        const prod = this.products[productId];
        if (!prod) return 0;
        return prod.pointsBonus + Math.floor(importoEur * 0.5);
    }
};
