const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.removeStaleFavorites = functions.database
  .ref('/recipes/{recipeId}')
  .onDelete(async (snapshot, context) => {
    const recipeId = context.params.recipeId;
    const db = admin.database();
    const usersSnapshot = await db.ref('users').once('value');

    if (!usersSnapshot.exists()) return null;

    const users = usersSnapshot.val();
    for (const userId in users) {
      const userFavoritesRef = db.ref(`users/${userId}/favorites/${recipeId}`);
      await userFavoritesRef.remove();
    }

    return null;
  });
