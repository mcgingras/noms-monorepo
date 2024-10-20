import { ponder } from "@/generated";
import { eq, graphql, sql, like, or, and } from "@ponder/core";

ponder.use("/graphql", graphql());
ponder.use("/", graphql());

/// api functions
ponder.get("/api/noms/count", async (c) => {
  const count = await c.db.select({ count: sql`count(*)` }).from(c.tables.Nom);
  return c.json(count);
});

ponder.get("/api/traits/count", async (c) => {
  const { Trait } = c.tables;

  let type = c.req.query("type") || "";
  const name = c.req.query("name") || "";
  const creator = c.req.query("creator") || "";

  if (type === "all") {
    type = "";
  }

  const count = await c.db
    .select({ count: sql`count(*)` })
    .from(Trait)
    .where(
      and(
        or(eq(Trait.type, ""), like(Trait.type, `%${type}%`)),
        or(eq(Trait.name, ""), like(Trait.name, `%${name}%`)),
        or(eq(Trait.creator, ""), like(Trait.creator, `%${creator}%`))
      )
    );
  return c.json(count);
});

ponder.get("/api/traits/stats/:traitId", async (c) => {
  const { NomTrait } = c.tables;
  const traitId = c.req.param("traitId");

  const nomTraits = await c.db
    .select()
    .from(NomTrait)
    .where(eq(NomTrait.traitId, BigInt(traitId)));

  const bought = nomTraits.filter((t) => t.quantity > 0).length;
  const wearing = nomTraits.filter((t) => t.equipped).length;

  return c.json({ bought, wearing });
});
