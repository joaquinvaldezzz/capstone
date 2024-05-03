import axios from "axios"

export default class Database {
  private readonly URL = "http://localhost:5050/record"

  /**
   * Connects to the database.
   * @returns A promise that resolves when the connection is successful.
   */
  async connect(): Promise<void> {
    axios.defaults.withCredentials = true
    axios
      .get(this.URL)
      .then((response) => {
        if (response.status === 200) {
          console.log("Connected to the database")
          console.log(response.status)
        }
      })
      .catch((error) => {
        console.error("Failed to connect to the database")
        console.error(error)
      })
  }

  /**
   * Signs up a user with the provided username and password.
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<void>} - A promise that resolves when the sign up is successful.
   */
  async signUp(username: string, password: string): Promise<void> {
    await axios
      .post(`${this.URL}/sign-up`, {
        username,
        password,
      })
      .then((response) => {
        console.log("Signed up the user")
        console.log(response.status)
      })
      .catch((error) => {
        console.error("Failed to sign up the user")
        console.error(error)
      })
  }

  /**
   * Logs in a user with the provided username and password.
   * @param username - The username of the user.
   * @param password - The password of the user.
   * @returns A Promise that resolves to void.
   */
  async logIn(username: string, password: string): Promise<void> {
    await axios
      .get(`${this.URL}/log-in`, {
        params: {
          username,
          password,
        },
      })
      .then((response) => {
        console.log("Logged in the user")
        console.log(response.status)
      })
      .catch((error) => {
        console.error("Failed to log in the user")
        console.error(error)
      })
  }

  /**
   * Clears the database by sending a POST request to the specified URI.
   * @returns A Promise that resolves when the database is cleared successfully, or rejects with an
   * error if the clearing process fails.
   */
  async clear(): Promise<void> {
    axios
      .post(`${this.URL}/clear`)
      .then((response) => {
        console.log("Cleared the database")
        console.log(response.status)
      })
      .catch((error) => {
        console.error("Failed to clear the database")
        console.error(error)
      })
  }
}
