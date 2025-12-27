<script setup>

// src/views/central/CreateTenant.vue (Logic Only)
const createTenant = async () => {
  const payload = {
    id: "toko-baru",        // Tenant ID
    domain: "tokobaru",     // Subdomain
    email: "admin@toko.com",
    password: "password123"
  };
  
  try {
    const res = await api.post('/central/tenants', payload);
    alert("Tenant Created! Access at: " + res.data.login_url);
  } catch (err) {
    console.error(err.response.data);
  }
};

</script>