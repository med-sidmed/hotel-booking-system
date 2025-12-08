import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      title: "Avis authentiques qui comptent",
      description: "Des commentaires vérifiés de vrais voyageurs pour vous aider à prendre la meilleure décision."
    },
    {
      id: 2,
      title: "Hôtels vérifiés en Mauritanie",
      description: "Tous nos hôtels sont soigneusement sélectionnés et vérifiés pour garantir votre satisfaction."
    },
    {
      id: 3,
      title: "Processus de réservation fluide",
      description: "Réservez en quelques clics avec notre interface intuitive et sécurisée."
    }
  ];

  return (
    <section className="why-choose-us">
      <div className="why-choose-us-container">
        <h2 className="section-title">POURQUOI NOUS CHOISIR ?</h2>
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">
                <span>✓</span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

