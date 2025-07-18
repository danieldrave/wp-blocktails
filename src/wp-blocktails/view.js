import React from 'react';
import { createRoot } from 'react-dom/client';
import { Spinner } from '@wordpress/components';

/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

/**
 * WP Blocktails Frontend
 * @param {Number} id
 */
class WPBlocktailView {
  getCocktail = async id => {
    return await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(response => response.json())
    .then(data => data.drinks.at(0) ?? null);
  };
};

const WPBlocktailsFrontEnd = ({ recipe }) => {
  return (
    <div className="wp-blocktails-cocktail">
      <div className="wp-blocktails-cocktail-header">
        <img
          src={recipe.strDrinkThumb}
          alt={recipe.strDrink}
          width="128"
          height="128"
          className="wp-blocktails-cocktail-image"
        />
        <div class="wp-blocktails-cocktail-meta">
          <h2> {recipe.strDrink} </h2>
          <p> {recipe.strInstructions} </p>
          <ul>
            {Object.keys(recipe)
              .filter(key => key.startsWith(`strIngredient`) && recipe[key])
              .map((key, index) => (
                <li key={index}>
                  {recipe[key]} {recipe[`strMeasure${index + 1}`] ? `(${recipe[`strMeasure${index + 1}`]})` : ``}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const cocktails = document.querySelectorAll(`[data-wp-blocktail-id]`);
cocktails.forEach(el => {
  const id = el.getAttribute(`data-wp-blocktail-id`);
  const root = createRoot(el);
  root.render(<Spinner />);
  new WPBlocktailView().getCocktail(id)
    .then(recipe => root.render(<WPBlocktailsFrontEnd recipe={recipe} />));
});