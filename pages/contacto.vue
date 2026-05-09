<script setup lang="ts">
useSeoMeta({
  title: 'Contacto - TuTurno',
  description: 'Contáctanos. Estamos aquí para ayudarte con cualquier duda sobre TuTurno.',
})

useHead({ htmlAttrs: { lang: 'es' } })

const contactInfo = {
  email: 'hola@tuturno.co',
  soporte: 'soporte@tuturno.co',
  phone: '+57 300 123 4567',
  whatsapp: '+573001234567',
  address: 'Montería, Córdoba, Colombia',
  hours: 'Lunes a Viernes, 8:00 AM - 6:00 PM (Colombia, UTC-5)',
}

const socialLinks = [
  {
    label: 'LinkedIn',
    icon: 'lucide:linkedin',
    href: '#',
    color: 'hover:bg-blue-500/10 hover:text-blue-400',
  },
  {
    label: 'X (Twitter)',
    icon: 'lucide:twitter',
    href: '#',
    color: 'hover:bg-zinc-500/10 hover:text-white',
  },
  {
    label: 'Instagram',
    icon: 'lucide:instagram',
    href: '#',
    color: 'hover:bg-pink-500/10 hover:text-pink-400',
  },
  {
    label: 'WhatsApp',
    icon: 'lucide:message-circle',
    href: `https://wa.me/${contactInfo.whatsapp}`,
    color: 'hover:bg-green-500/10 hover:text-green-400',
  },
]
</script>

<template>
  <div class="min-h-[100dvh] flex flex-col selection:bg-indigo-500/30">
    <LandingHeader />

    <main class="flex-1 pt-24 lg:pt-32 pb-24">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1100px]">

        <!-- Hero -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-full text-xs font-medium text-zinc-400 uppercase tracking-wide mb-8">
            <Icon name="lucide:mail" class="w-3.5 h-3.5 text-violet-400" />
            Contacto
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-white mb-6 tracking-tighter">
            Estamos para ayudarte
          </h1>
          <p class="text-lg text-zinc-400 max-w-xl mx-auto">
            ¿Tienes dudas, propuestas o necesitas ayuda? Escríbenos y te responderemos lo antes posible.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-12">

          <!-- Contact form -->
          <div class="lg:col-span-3">
            <div class="glass rounded-3xl border border-white/[0.08] p-8 lg:p-10">
              <h2 class="text-2xl font-semibold text-white mb-6">Envíanos un mensaje</h2>
              <LandingContactForm />
            </div>
          </div>

          <!-- Contact info -->
          <div class="lg:col-span-2 space-y-6">

            <!-- Direct contact -->
            <div class="glass rounded-2xl border border-white/[0.08] p-6 space-y-5">
              <h3 class="font-semibold text-white">Contacto directo</h3>

              <a
                :href="`mailto:${contactInfo.email}`"
                class="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group"
              >
                <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-violet-500/10 transition-colors">
                  <Icon name="lucide:mail" class="w-4 h-4" />
                </div>
                <span>{{ contactInfo.email }}</span>
              </a>

              <a
                :href="`tel:${contactInfo.phone}`"
                class="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group"
              >
                <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-violet-500/10 transition-colors">
                  <Icon name="lucide:phone" class="w-4 h-4" />
                </div>
                <span>{{ contactInfo.phone }}</span>
              </a>

              <a
                :href="`https://wa.me/${contactInfo.whatsapp}`"
                target="_blank"
                class="flex items-center gap-3 text-zinc-400 hover:text-green-400 transition-colors group"
              >
                <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-green-500/10 transition-colors">
                  <Icon name="lucide:message-circle" class="w-4 h-4" />
                </div>
                <span>WhatsApp</span>
              </a>

              <div class="flex items-start gap-3 text-zinc-400">
                <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="lucide:map-pin" class="w-4 h-4" />
                </div>
                <div>
                  <span>{{ contactInfo.address }}</span>
                </div>
              </div>
            </div>

            <!-- Hours -->
            <div class="glass rounded-2xl border border-white/[0.08] p-6">
              <h3 class="font-semibold text-white mb-3">Horario de atención</h3>
              <p class="text-sm text-zinc-400 flex items-center gap-2">
                <Icon name="lucide:clock" class="w-4 h-4 text-zinc-500" />
                {{ contactInfo.hours }}
              </p>
            </div>

            <!-- Social -->
            <div class="glass rounded-2xl border border-white/[0.08] p-6">
              <h3 class="font-semibold text-white mb-4">Síguenos</h3>
              <div class="flex items-center gap-3">
                <a
                  v-for="social in socialLinks"
                  :key="social.label"
                  :href="social.href"
                  :aria-label="social.label"
                  class="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 transition-all"
                  :class="social.color"
                >
                  <Icon :name="social.icon" class="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>

    <LandingFooter />
  </div>
</template>