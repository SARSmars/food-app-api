import express from 'express';
import {db} from './config/db.js';
const app = express();
import { ENV } from  './config/env.js';
const PORT = ENV.PORT;
import { favoritesTable } from './db/schema.js';
import { and, eq } from "drizzle-orm";


app.use(express.json());

// Set the favourite

app.post('/api/favourites', async (req, res) => {
   try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newFavorite = await db    
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();

    res.status(201).json(newFavorite[0]);
  }  catch (error) {
    console.log("Error adding favorite", error);
    res.status(500).json({ error: "Something went wrong" });
  }
})

// Delete

app.delete('/api/favourites/:userId/:recipeId', async(req, res) =>{
try {
    const { userId, recipeId } = req.params;

        await db  
      .delete(favoritesTable)
      .where(
        and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, parseInt(recipeId)))
      );

      res.status(204).json({ message: "Favorite removed successfully" });
  
} catch (error) {
    console.log("Error removing a favorite", error);
    res.status(500).json({ error: "Something went wrong" });
}
})

// Get

app.get('/api/favourites/:userId', async(req, res) => {
  try {
      const { userId } = req.params;

      const userFavorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));

    res.status(200).json(userFavorites);

  } catch (error) {
     console.log("Error fetching the favorites", error);
    res.status(500).json({ error: "Something went wrong" });
  }
})

app.listen(PORT, () => {
  console.log('Server is running on port ', PORT);
});