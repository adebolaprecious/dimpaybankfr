const StatCard =({ title, amount }) =>{
return (
<div className="stat-card">
<p>{title}</p>
<h3>{amount}</h3>
</div>
);
}
export default StatCard