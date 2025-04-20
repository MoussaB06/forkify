import * as model from './model.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
import resultsView from './Views/resultsView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// Declarations des Fonctions
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    /// Loading the recipe
    // La recette loader vas etre stocké dans l'objet state dans model
    await model.loadRecipe(id);

    // Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    // On ne la stock pas dans une const car elle ne retourne rien
    await model.loadSearchResults(query);

    // console.log(model.getSearchResultsPage(1));

    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
  } catch (err) {
    console.error(err);
  }
};

// controlSearchResults();

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

// Appel des Fonctions
init();
