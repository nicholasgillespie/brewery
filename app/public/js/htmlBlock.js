const htmlBlock = {
  beer: `
    <form class="[ stack ][ u-padding ][ b-admin-item ]">

      <div class="flow">
        <label for="name">name:</label>
        <input type="text" id="name" placeholder="name">
      </div>

      <div class="flow">
        <label for="description">description:</label>
        <textarea id="description" placeholder="description"></textarea>
      </div>

      <div class="flow">
        <label for="keywords">keywords:</label>
        <input type="text" id="keywords" placeholder="keywords">
      </div>

      <div class="flow">
        <label for="style">style:</label>
        <input type="text" id="style" placeholder="style">
      </div>

      <div class="switcher">
        <div class="flow">
            <label for="abv">abv:</label>
            <input type="text" id="abv" placeholder="abv">
        </div>
        <div class="flow">
          <label for="ibu">ibu:</label>
          <input type="text" id="ibu" placeholder="ibu">
        </div>
        <div class="flow">
          <label for="ebv">ebv:</label>
          <input type="text" id="ebv" placeholder="ebv">
        </div>
      </div>

      <div class="flow">
        <label for="malts">malts:</label>
        <input type="text" id="malts" placeholder="malts">
      </div>
      <div class="flow">
        <label for="hops">hops:</label>
        <input type="text" id="hops" placeholder="hops">
      </div>
      <div class="flow">
        <label for="spices">spices:</label>
        <input type="text" id="spices" placeholder="spices">
      </div>

      <div class="switcher">
        <div class="flow">
          <label for="image">image:</label>
          <input type="file" id="image" accept="image/*">
        </div>
        <div class="flow">
          <label for="cover">cover image:</label>
          <input type="file" id="cover" accept="image/*">
        </div>
        <div class="flow">
          <label for="aroma-web">aroma web image:</label>
          <input type="file" id="aroma-web" accept="image/*">
        </div>
      </div>`,

  location: `
    <form class="[ stack ][ u-padding ][ b-admin-item ]">
    
      <div class="flow">
        <label for="name">name:</label>
        <input type="text" id="name" placeholder="name">
      </div>

      <fieldset>
        <legend>beer available on:</legend>
        <div>
          <input type="checkbox" id="tap" name="available">
          <label for="tap">tap</label>
        </div>
        <div>
          <input type="checkbox" id="bottle" name="available">
          <label for="bottle">bottle</label>
        </div>
      </fieldset>

      <div class="flow">
        <label for="address">address:</label>
        <input type="text" id="address" placeholder="address">
      </div>

      <div class="switcher">
        <div class="flow">
          <label for="postalCode">postal code:</label>
          <input type="text" id="postalCode" placeholder="postal code">
        </div>
        <div class="flow">
          <label for="city">city:</label>
          <input type="text" id="city" placeholder="city">
        </div>
      </div>

      <div class="flow">
        <label for="country">country:</label>
        <input type="text" id="country" placeholder="country">
      </div>

      <div class="flow">
        <label for="website">website:</label>
        <input type="text" id="website" placeholder="website">
      </div>`,

  actu: `
    <form class="[ stack ][ u-padding ][ b-admin-item ]">

      <div class="flow">
        <label for="type">type:</label>
        <select id="type">
          <option value="">select type</option>
          <option value="actu">actu</option>
          <option value="event">event</option>
        </select>
      </div>

      <div class="flow">
        <label for="title">title:</label>
        <input type="text" id="title" placeholder="title">
      </div>

      <div class="flow">
        <label for="description">description:</label>
        <textarea id="description" placeholder="description"></textarea>
      </div>

      <div class="switcher">
        <div class="flow">
          <label for="date">date:</label>
          <input type="date" id="date" placeholder="date">
        </div>

        <div class="flow">
          <label for="time">time:</label>
          <input type="time" id="time" placeholder="time">
        </div>
      </div>
      
      <div class="flow">
        <label for="address">address:</label>
        <input type="text" id="address" placeholder="address">
      </div>
      
      <div class="flow">
        <label for="postalCode">postal code:</label>
        <input type="text" id="postalCode" placeholder="postal code">
      </div>

      <div class="flow">
        <label for="city">city:</label>
        <input type="text" id="city" placeholder="city">
      </div>

      <div class="flow">
        <label for="country">country:</label>
        <input type="text" id="country" placeholder="country">
      </div>

      <div class="switcher">
        <div class="flow">
          <label for="image">image:</label>
          <input type="file" id="image" accept="image/*">
        </div>,
      </div>`,

  artiste: `
    <form class="[ stack ][ u-padding ][ b-admin-item ]">

      <div class="flow">
        <label for="firstname">firstname:</label>
        <input type="text" id="firstname" placeholder="firstname">
      </div>

      <div class="flow">
        <label for="surname">surname:</label>
        <input type="text" id="surname" placeholder="surname">
      </div>
      
      <div class="flow">
        <label for="description">description:</label>
        <textarea id="description" placeholder="description"></textarea>
      </div>

      <div class="flow">
        <label for="email">email:</label>
        <input type="email" id="email" placeholder="email">
      </div>

      <div class="flow">
        <label for="pseudonym">pseudonym:</label>
        <input type="text" id="pseudonym" placeholder="pseudonym">
      </div>

      <div class="flow">
        <label for="website">website:</label>
        <input type="url" id="website" placeholder="website">
      </div>

      <div class="flow">
        <label for="facebook">facebook:</label>
        <input type="url" id="facebook" placeholder="facebook">
      </div>

      <div class="flow">
        <label for="instagram">instagram:</label>
        <input type="url" id="instagram" placeholder="instagram">
      </div>

      <div class="flow">
        <label for="twitter">twitter:</label>
        <input type="url" id="twitter" placeholder="twitter">
      </div>

      <div class="flow">
        <label for="youtube">youtube:</label>
        <input type="url" id="youtube" placeholder="youtube">
      </div>
      
      <div class="switcher">
        <div class="flow">
          <label for="image">image:</label>
          <input type="file" id="image" accept="image/*">
        </div>,
      </div>`,

  user: `
    <form class="[ stack ][ u-padding ][ b-admin-item ]">

      <div class="flow">
        <label for="name">name:</label>
        <input type="text" id="name" placeholder="name">
      </div>

      <div class="flow">
        <label for="email">email:</label>
        <input type="text" id="email" placeholder="email">
      </div>

      <div class="flow">
        <label for="role">role:</label>
        <input type="text" id="role" placeholder="role">
      </div>`,
};

export default htmlBlock;
