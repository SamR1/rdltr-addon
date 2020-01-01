<template>
  <div>
    <h1>rdltr options</h1>
    <form>
      <ul class="rdltr-form">
        <li>
          <label for="url">Instance url</label>
          <input
            type="text"
            id="url"
            placeholder="Enter your rdltr instance url"
          />
        </li>
        <li>
          <label for="email">Email</label>
          <input type="email" id="email" />
        </li>
        <li>
          <label for="password">Password</label>
          <input type="password" id="password" />
        </li>
        <li>
          <button type="submit">Connect to rdltr</button>
        </li>
      </ul>
    </form>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style src="../assets/rdltr.css"></style>
