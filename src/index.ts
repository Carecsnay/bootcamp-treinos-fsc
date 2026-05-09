import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import Fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";

const app = Fastify({
    logger: true,
});

await app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Bootcamp Treinos API",
            description: "API para o bootcamp de treinos do FSC",
            version: "1.0.0",
        },
        servers: [
            {
                description: "Localhost",
                url: "http://localhost:3000",
            },
        ],
    },
    transform: jsonSchemaTransform,
});

await app.register(fastifySwaggerUI, {
    routePrefix: "/docs",
});

const LOGIN_SCHEMA = z.object({
    username: z.string().max(32).describe("Some description for username"),
    password: z.string().max(32),
});

app.after(() => {
    app.withTypeProvider<ZodTypeProvider>().route({
        method: "POST",
        url: "/login",
        schema: { body: LOGIN_SCHEMA },
        handler: (req, res) => {
            res.send("ok");
        },
    });
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
        response: {
            200: z.object({
                message: z.string(),
            }),
        },
        tags: ["Hello World"],
        description: "Hello World",
    },
    handler: () => {
        return {
            message: "Hello World",
        };
    },
});

try {
    await app.listen({ port: Number(process.env.PORT) || 3000 });
} catch (err) {
    app.log.error(err);
    process.exit(1);
}
