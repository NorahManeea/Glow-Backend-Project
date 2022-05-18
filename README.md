# Express Assignment

Create a REST API with express with the following requirements:

1. The API has 3 routers, choose the set relevant to your chosen topic in the database lecture:

   - `user`, `book` and `author`
   - `user`, `product` and `variant`

2. Each router should be able to execute CRUD operations. For now, the logic for the CRUD operation can be omitted. For example:

   ```js
   userRouter.get('/all', (req, res) => {})
   userRouter.post('/', (req, res) => {})
   ```

3. Remember to connect the routers to your app instance

4. Use global middleware in your app to allow reading json and form data

5. Create a custom middleware that will log information of every request. The information could contain current date time, path. The log should be stored inside a file (use `fs` module for this)

6. Create error handler middleware

7. Make sure to explore the folder structure to know where to put your code
