const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			logout: () => {
				sessionStorage.removeItem("token");
				console.log("login out")
				const store = getStore();
				setStore({ ...store, token: null, email: "",
					password: "", });
			},


			syncTokenFromSessionStore: () => {
				const token = sessionStorage.getItem("token");
				const store = getStore();
				if (store.token && store.token != "" && store.token != undefined) {
					setStore({ ...store, token: token });
				}
			},

			signUp: async (formData) => {
				try {
					const response = await fetch('https://super-duper-space-bassoon-69g74jvvvp9gc67j-3001.app.github.dev/api/signup', {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(formData)
					});
					if (!response.ok) {
						const data = await response.json();
						throw new Error(data.message || "Error al registrar usuario");
					}
					localStorage.setItem('formData', JSON.stringify(formData));
				} catch (error) {
					throw error;
				}
			},

			login: async (email, password) => {

				const options = {
					headers: {
						"Content-type": "application/json"
					},
					method: 'POST',
					body: JSON.stringify({
						"email": email,
						"password": password
					})
				};

				try {
					const response = await fetch('https://super-duper-space-bassoon-69g74jvvvp9gc67j-3001.app.github.dev/api/token', options)
					if (response.status !== 200) {
						alert("it has ocurred a problem");
						return false;
					}

					const data = await response.json();
					console.log("this comes from the back end", data);
					sessionStorage.setItem("token", data.access_token)
					setStore({ token: data.token })
					return true;

				}
				catch (error) {
					console.log("there has been an error login in")
				}
			},








			getMessage: async () => {
				const store = getStore();
				const options = {
					headers: {
						"Authorization": "Bearer " + sessionStorage.getItem("token")
					}
				}
				try {
					// fetching data from the backend
					const resp = await fetch("https://super-duper-space-bassoon-69g74jvvvp9gc67j-3001.app.github.dev/api/hello", options)
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
	
	
			changeColor: (index, color) => {
				//get the store
				const store = getStore();
	
				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});
	
				//reset the global store
				setStore({ demo: demo });
			}

		}
	}
};

export default getState;
