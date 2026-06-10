function KpiCard({ title, value }) {
  return (
    <div className="kpi-card">
      <div className="kpi-content">
        <span className="kpi-title">
          {title}
        </span>

        <h2 className="kpi-value">
          {value}
        </h2>
      </div>
    </div>
  );
}

export default KpiCard;