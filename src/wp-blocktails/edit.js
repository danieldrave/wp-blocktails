/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useEffect, useState } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function WPBlocktail({ attributes, setAttributes }) {
  const [cocktail, setCocktailRecipe] = useState(null);

  useEffect(() => {
    if (!attributes.id) getCocktail();
    else setCocktailRecipe(attributes.content);
  }, [attributes.id]);

  const getData = async () => {
    const url = `https://thecocktaildb.com/api/json/v1/1/random.php`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      // In a prod environment, I'd have this render as a localised toast / error message
      console.error(error.message);
      return;
    }
  };

  const getCocktail = () => {
    getData()
      .then(({ drinks }) => setCocktail(drinks));
  };

  const setCocktail = (drinks) => {
    const recipe = drinks.at(0);
    setCocktailRecipe(recipe);
    setAttributes({
      content: recipe,
      id: recipe.idDrink
    });
  };

  return (
    <div {...useBlockProps() }>
      <div class="wp-blocktails-details">
        <img
          src={cocktail?.strDrinkThumb}
          alt={cocktail?.strDrink}
          height="64"
          width="64"
        />
        <div class="wp-blocktails-details__content">
          <span>{__(`${cocktail?.strDrink || ''}`)}</span>
          <span>
            {__(`${cocktail?.strCategory || ''} - ${cocktail?.strAlcoholic || ''}`)}
          </span>
        </div>
      </div>
      <button onClick={getCocktail}>
        {__('Mix it up!', 'wp-blocktails')}
      </button>
    </div>
  );
}
