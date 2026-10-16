/**
 * SUPREMA FUTURE X // MASTER CATALOG DATA V42
 * Governance: CEO Giuliano Caratelli
 * Assets: Opal Luxury Collection, Innovation Tech & Negozi Digitali
 */

window.SFX_CATALOG = {
    products: {
        opal_knobs: {
            id: "OPAL-SFX-2026-PAT",
            name: "Opal Luxury Collection",
            category: "Luxury Fittings & Interior",
            tagline: "Finiture Sartoriali in Oro 24K e Castoni in Opale Nobile",
            description: "Esclusiva linea di finiture d'arredo per yacht, dimore d'élite e suite executive. Lavorazione artigianale con dettagli in Ciano Sovrano e Oro Imperiale.",
            media: "media/boutique-luxury.png",
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
            id: "INNOV-SFX-2026-X",
            name: "Linea Innovation Tech & Polo Scientifico",
            category: "Advanced Technology & Design",
            tagline: "Sospensione Elettromagnetica Neurale ad Alta Frequenza",
            description: "Sistema di stabilità avanzata per ambienti direzionali e showroom VIP. Design avveniristico integrato con l'Ecosistema Neurale Suprema.",
            media: "media/alison-lifestyle.png",
            pointsBonus: 1000,
            statusRequired: "GRADO 3 // GOLD MEMBER",
            specs: {
                technology: "Campo a induzione costante con regolazione neurale dinamica",
                power: "Alimentazione stealth a basso consumo, standby automatico",
                finish: "Finitura Bianco Perlato, bordi glowing Ciano/Oro"
            },
            targetActions: ["CANDIDATURA_INNOVATION", "DEMO_SHOWROOM"]
        },
        negozi_digitali: {
            id: "ECOM-SFX-2026-PRO",
            name: "Attività Commerciale Digitale Chiavi in Mano",
            category: "Business & Digital Assets",
            tagline: "Infrastruttura E-commerce ad Alto Rendimento con Magazzino Zero",
            description: "Piattaforma commerciale pronta all'uso, integrata con gateway di pagamento EAL6+, logistica automatizzata e supervisione dei 15 Agenti AI.",
            media: "media/accademia-corsi.png",
            pointsBonus: 1500,
            statusRequired: "GRADO 4 // PLATINUM EXECUTIVE",
            specs: {
                setup: "Consegna chiavi in mano entro 48 ore dall'accredito",
                integrations: "Gateway Stripe/PayPal, CRM Nexus, Flotta Neurale AG-01",
                support: "Assistenza tecnica dedicata H24 e coaching direttivo"
            },
            targetActions: ["ATTIVA_NEGOZIO", "CONFERENZA_CEO"]
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
