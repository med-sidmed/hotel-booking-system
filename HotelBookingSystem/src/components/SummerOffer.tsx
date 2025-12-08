import './SummerOffer.css';

const SummerOffer = () => {
  return (
    <section className="summer-offer">
      <div className="summer-offer-banner">
        <h2>OFFRE D'ÉTÉ</h2>
      </div>
      <div className="summer-offer-content">
        <div className="offer-text">
          <p className="offer-description">
            Réservez et profitez jusqu'à <span className="discount">10% de réduction</span> sur carte de crédit / débit
          </p>
          <button className="explore-btn">Découvrez-nous</button>
        </div>
        <div className="credit-card-container">
          <div className="credit-card">
            <div className="card-header">
              <div className="card-chip"></div>
              <div className="mastercard-logo">MC</div>
            </div>
            <div className="card-balance">Solde actuel $5,750,20</div>
            <div className="card-number">5242 3456 7880 1280</div>
            <div className="card-footer">
              <div className="card-expiry">
                <span className="expiry-label">09/25</span>
                <span className="expiry-label">08/25</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SummerOffer;

