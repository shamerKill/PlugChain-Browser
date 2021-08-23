# Oracle Network Protocol Chain Browser

> now, we had the developers of back-end :happy:

### [about `.env` directory](#env-directory)<div id="env-directory"></div>

you need create the `.env` directory to src directory, and some files to `.env`
- `base.env.json`
  - ```json
    WALLET_ADDRESS_PREFIX: " *** " // prefix's name
    ```
  
- `deploy-prod.env.json`
  - ```json
    BASE_URL: " http://*** " // URI for fetch use with development's mode
    ```

- `deploy-test.env.json`
  - ```json
    BASE_URL: " https://*** " // URI for fetch use with production's mode
    ```

- `dev-prod.env.json`
  - ```json
    BASE_URL: " https://*** " // URI for fetch use with test's mode
    ```

- `dev-test.env.json`
  - ```json
    BASE_URL: " https://*** " // URI for fetch use with test's mode
    ```

- `test-prod.env.json`
  - ```json
    BASE_URL: " https://*** " // URI for fetch use with test's mode
    ```

- `test-test.env.json`
  - ```json
    BASE_URL: " https://*** " // URI for fetch use with test's mode
    ```