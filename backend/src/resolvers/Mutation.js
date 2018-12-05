const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, makeANiceEmail } = require("../mail");
const { hasPermission } = require("../utils");

const Mutations = {
  async createRecipe(parent, args, ctx, info) {
    // Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to do that!");
    }

    const recipe = await ctx.db.mutation.createRecipe(
      {
        data: {
          // This is how to create a relationship between the Recipe and the User
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info
    );

    console.log(recipe);

    return recipe;
  },

  updateRecipe(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args };
    // remove the ID from the updates
    delete updates.id;
    // run the update method
    return ctx.db.mutation.updateRecipe(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async deleteRecipe(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. find the recipe
    const recipe = await ctx.db.query.recipe(
      { where },
      `{ id name user { id }}`
    );
    // 2. Check if they own that recipe, or have the permissions
    const ownsRecipe = recipe.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ["ADMIN", "RECIPEDELETE"].includes(permission)
    );

    if (!ownsRecipe && !hasPermissions) {
      throw new Error("You don't have permission to do that!");
    }

    // 3. Delete it!
    return ctx.db.mutation.deleteRecipe({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    // lowercase their email
    args.email = args.email.toLowerCase();
    // hash their password
    const password = await bcrypt.hash(args.password, 10);
    // create the user in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] }
        }
      },
      info
    );
    // create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // We set the jwt as a cookie on the response
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    // Finalllllly we return the user to the browser
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    // 1. check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. Check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid Password!");
    }
    // 3. generate the JWT Token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4. Set the cookie with the token
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    // 5. Return the user
    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "You have successfully logged out!" };
  },
  async requestReset(parent, args, ctx, info) {
    // 1. Check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }
    // 2. Set a reset token and expiry on that user
    const randomBytesPromiseified = promisify(randomBytes);
    const resetToken = (await randomBytesPromiseified(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });
    // console.log(res);
    // 3. Email them that reset token
    const mailRes = await transport.sendMail({
      from: "reset@KoozieMadness.com",
      to: user.email,
      subject: "Your Password Reset Token",
      html: makeANiceEmail(`Your Password Reset Token is here!
      \n\n
      <a href="${
        process.env.FRONTEND_URL
      }/reset?resetToken=${resetToken}">Click Here to Reset</a>`)
    });

    // 4. Return the message
    return { message: "Thanks!" };
  },
  async resetPassword(parent, args, ctx, info) {
    // 1. check if the passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error("Passwords don't match!");
    }
    // 2. check if its a legit reset token
    // 3. Check if its expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });
    if (!user) {
      throw new Error("This token is either invalid or expired!");
    }
    // 4. Hash their new password
    const password = await bcrypt.hash(args.password, 10);
    // 5. Save the new password to the user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    // 6. Generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // 7. Set the JWT cookie
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    // 8. return the new user
    return updatedUser;
  },
  async updatePermissions(parent, args, ctx, info) {
    // 1. Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in!");
    }
    // 2. Query the current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId
        }
      },
      info
    );
    // 3. Check if they have permissions to do this
    hasPermission(currentUser, ["ADMIN", "PERMISSIONUPDATE"]);
    // 4. Update the permissions
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions
          }
        },
        where: {
          id: args.userId
        }
      },
      info
    );
  },
  async addToFavorites(parent, args, ctx, info) {
    // 1. Make sure they are signed in
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error("You must be signed in");
    }
    // 2. Query the users current favorite
    const [existingFavoriteRecipe] = await ctx.db.query.favoriteRecipes({
      where: {
        user: { id: userId },
        recipe: { id: args.id }
      }
    });
    // 3. Check if that recipe is already in their favorite
    if (existingFavoriteRecipe) {
      console.log("This recipe is already in the favorite");
      return ctx.db.mutation.updateFavoriteRecipe(
        {
          where: { id: existingFavoriteRecipe.id },
          data: { recipe: existingFavoriteRecipe.recipe }
        },
        info
      );
    }
    // 4. If its not, create a fresh FavoriteRecipe for that user!
    return ctx.db.mutation.createFavoriteRecipe(
      {
        data: {
          user: {
            connect: { id: userId }
          },
          recipe: {
            connect: { id: args.id }
          }
        }
      },
      info
    );
  },
  async removeFromFavorites(parent, args, ctx, info) {
    // 1. Find the favorite recipe
    const favoriteRecipe = await ctx.db.query.favoriteRecipe(
      {
        where: {
          id: args.id
        }
      },
      `{ id, user { id }}` // we also need to know who owns that recipe
    );
    // 1.5 Make sure we found a recipe
    if (!favoriteRecipe) throw new Error("No FavoriteRecipe Found!");
    // 2. Make sure they own that favorite recipe
    if (favoriteRecipe.user.id !== ctx.request.userId) {
      throw new Error("No sir!");
    }
    // 3. Delete that favorite recipe
    return ctx.db.mutation.deleteFavoriteRecipe(
      {
        where: { id: args.id }
      },
      info
    );
  },
  async updatePassword(parent, args, ctx, info) {
    // 1. Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in!");
    }
    // 2. Query the current user
    const user = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId
        }
      },
      info
    );
    // const user = await ctx.db.query.user({ where: { email } });
    // 3. check if the passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error("Passwords don't match!");
    }
    // 4. Hash their new password
    const password = await bcrypt.hash(args.password, 10);
    // 5. Save the new password to the user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password
      }
    });
    // 6. Generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // 7. Set the JWT cookie
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    // 8. return the new user
    return updatedUser;
  }
};

module.exports = Mutations;
