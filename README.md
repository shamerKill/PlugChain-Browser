# Oracle Network Protocol Chain Browser

> now, we had the developers of back-end :happy:

### [about `.env` directory](#env-directory)<div id="env-directory"></div>

you need create the `.env` directory to src directory, and some files to `.env`
- `base.env.json`
  - ```json
    SAVE_DATABASE_NAME: " *** " // localStorage's name
    ```
  
- `development.env.json`
  - ```json
    BASE_URL: " http://*** " // URI for fetch use with development's mode
    ```
- `production.env.json`
  - ```json
    BASE_URL: " https://*** " // URI for fetch use with production's mode
    ```
- `test.env.json`
  - ```json
    BASE_URL: " https://*** " // URI for fetch use with test's mode
    ```
