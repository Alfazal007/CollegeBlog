export default function () {
    return (<div className="text-2xl font-bold">Hello world</div>)
}
// docker run -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
// docker exec -it  <container-name> psql -U postgres postgres
// npx prisma migrate dev --name init
// docker run -d -p 6379:6379 redis
//
//
// TODO: BE:: WRITE DOCKERFILE AND DOCKERCOMPOSE FILES
//
// TODO: BE:: WRITE CI/CD PIPELINES
//
// TODO: BOTH:: DEPLOY
