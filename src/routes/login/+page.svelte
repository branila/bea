<script lang="ts">
  import PocketBase from 'pocketbase'

  const { data } = $props()

  async function auth() {
    const pb = new PocketBase(data.pb_instance)

    const authData = await pb.collection('users').authWithOAuth2({
      provider: 'oidc',
    })

    pb.authStore.save(authData.token, authData.record)

    document.cookie = pb.authStore.exportToCookie({
      httpOnly: false,
      secure: true,
      sameSite: 'strict',
    })

    window.location.href = '/cogestione'
  }
</script>

Login <br>
<button onclick={auth}>Accedi</button>

<style>
</style>
