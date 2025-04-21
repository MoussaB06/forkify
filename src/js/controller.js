import * as model from './model.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
import resultsView from './Views/resultsView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import paginationView from './Views/paginationView.js';

// if (module.hot) {
//   module.hot.accept();
// }

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// Declarations des Fonctions
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

    /// Loading the recipe
    // La recette loader vas etre stocké dans l'objet state dans model
    await model.loadRecipe(id);

    // Rendering the recipe
    recipeView.render(model.state.recipe);

    /*
    // Apres avoir chargé la recette on modifie ces ingredients avec ça !
    controlServings();
    */
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    /// 1 Get search Query
    const query = searchView.getQuery();
    if (!query) return;

    /// 2 Load search results
    // On ne la stock pas dans une const car elle ne retourne rien
    await model.loadSearchResults(query);

    /// 3 Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    /// 4 Render initials pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  /// Update the recipe servings (in state)
  model.updateServings(newServings);

  /// Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

// const controlAddBookMark = function () {
//   if (!model.state.recipe.bookMarked) model.addBookMark(model.state.recipe);
//   if (model.state.recipe.bookMarked)
//     model.deleteBookMark(model.state.recipe.id);
//   recipeView.update(model.state.recipe);
// };

const controlAddBookMark = function () {
  if (!model.state.recipe.bookMarked) {
    model.addBookMark(model.state.recipe);
  } else {
    model.deleteBookMark(model.state.recipe.id);
  }

  recipeView.update(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  // controlServings();
};
// if (model.state.recipe.ingredients) controlServings();

// Appel des Fonctions
init();
