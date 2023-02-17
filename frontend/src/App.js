import './App.css';

function App() {

	return (
		<div className="App">
			<div className="no-input">
				<h2>Role Based Access Control</h2>
				<button>Connect</button>
			</div>
			<hr class="solid"></hr>
			<div className="row">
				<h2>Grant Role</h2>
				<form>
					<input placeholder="Data Type: Address" />
					<button type="submit">Grant Role</button>
				</form>
			</div>
			<div className="row">
				<h2>Revoke Role</h2>
				<form>
					<input placeholder="Data Type: Address" />
					<button type="submit">Revoke Role</button>
				</form>
			</div>
			<div className="no-input">
				<h2>Renounce Role</h2>
				<form>
					<button>Renounce Role</button>
				</form>
			</div>
			<hr class="solid"></hr>
			<div className="row">
				<h2>Create Entry</h2>
				<form>
					<input placeholder="Data Type: String" />
					<button type="submit">Create Entry</button>
				</form>
			</div>
		</div>
	);
}

export default App;
