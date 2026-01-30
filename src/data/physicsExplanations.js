export const PHYSICS_DATA = {
    GALAXY: {
        title: "Galaxy Rotation Curve",
        object: "Galactic Bulge",
        type: "Baryonic Matter",
        newton: {
            title: "Newtonian Prediction",
            desc: "In standard gravity, orbital velocity should decrease with distance from the center (v ∝ 1/√r), similar to how planets orbit the Sun.",
            prediction: "Stars at the edge should move significantly slower than those near the center.",
            status: "fail"
        },
        mond: {
            title: "MOND Observation",
            desc: "Galaxies exhibit 'flat rotation curves'. Stars at the edge move much faster than expected, as if there is invisible mass or gravity is modified.",
            prediction: "Below acceleration a₀ ~ 1.2×10⁻¹⁰ m/s², gravity decays as 1/r instead of 1/r².",
            status: "success"
        },
        credibility: "MOND accurately predicts the rotation curves of over 150 galaxies with a single universal parameter (a₀), without requiring ad-hoc Dark Matter halos for each one."
    },
    CLUSTER: {
        title: "Galaxy Cluster Dynamics",
        object: "Cluster Center",
        type: "Intracluster Medium",
        newton: {
            title: "Newtonian Prediction",
            desc: "Galaxies in clusters move too fast to be held together by the visible mass alone.",
            prediction: "The cluster should fly apart unless 80-90% of the mass is invisible 'Dark Matter'.",
            status: "partial"
        },
        mond: {
            title: "MOND Observation",
            desc: "MOND boosts gravity, reducing the need for missing mass by factor of 2-3, but still requires some unseen matter (likely neutrinos).",
            prediction: "MOND alone is not enough for clusters; it predicts a 'residual mass discrepancy'.",
            status: "mixed"
        },
        credibility: "While MOND fixes galaxies perfectly, clusters remain its biggest challenge. It likely requires 'sterile neutrinos' (hot dark matter) to fully match observations."
    },
    BULLET: {
        title: "The Bullet Cluster",
        object: "Collision Interface",
        type: "Shock Front",
        newton: {
            title: "Dark Matter Interpretation",
            desc: "The gravitational lensing (mass) is offset from the X-ray gas (visible matter).",
            prediction: "Collisionless Dark Matter passed through, while gas slowed down. Proof of Dark Matter?",
            status: "success"
        },
        mond: {
            title: "MOND Interpretation",
            desc: "MOND can explain the offset if neutrinos carry significant mass, but the high collision velocity is actually hard for Dark Matter models to explain.",
            prediction: "The high collision speed (~3000 km/s) is naturally predicted by MOND but very rare in CDM simulations.",
            status: "debated"
        },
        credibility: "Often cited as 'proof of Dark Matter', but MOND with neutrinos is consistent with the lensing. The extreme collision speed actually favors MOND."
    },
    VOID: {
        title: "KBC Void & Hubble Tension",
        object: "Local Void Center",
        type: "Under-density",
        newton: {
            title: "Standard Cosmology (ΛCDM)",
            desc: "The universe should be homogenous on large scales. Large voids like the KBC (2 billion light years) are extremely unlikely.",
            prediction: "Hubble constant (H₀) should be the same everywhere.",
            status: "tension"
        },
        mond: {
            title: "MOND Cosmology",
            desc: "Structure forms faster in MOND. Large voids and massive structures form naturally and early.",
            prediction: "We live in a large void, which locally inflates our measurement of H₀, resolving the 'Hubble Tension'.",
            status: "promising"
        },
        credibility: "The 'Hubble Tension' (disagreement between early/late universe expansion rates) is naturally resolved if the Local Group is inside a profound MONDian void."
    }
};
