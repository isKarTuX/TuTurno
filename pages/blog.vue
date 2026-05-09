<script setup lang="ts">
useSeoMeta({
  title: 'Blog - TuTurno',
  description: 'Novedades, tips y casos de éxito de TuTurno. Todo sobre la transformación digital de la gestión de turnos en Colombia.',
})

useHead({ htmlAttrs: { lang: 'es' } })

const articles = [
  {
    slug: 'como-eliminamos-48-horas-al-ano',
    title: 'Cómo TuTurno elimina 48 horas de espera al año por ciudadano',
    excerpt: 'Un estudio de la Universidad de Córdoba revela el impacto del turno digital en la calidad de vida de los Monterianos.',
    category: 'Casos de éxito',
    categoryColor: 'violet',
    author: 'Equipo TuTurno',
    date: '15 de abril, 2025',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
    featured: true,
  },
  {
    slug: 'guia-rapida-primer-turno',
    title: 'Guía rápida: cómo sacar tu primer turno en menos de 2 minutos',
    excerpt: 'Paso a paso ilustrado para solicitar un turno digital desde tu celular sin complicaciones.',
    category: 'Tutorial',
    categoryColor: 'blue',
    author: 'Bibiana Herrera',
    date: '8 de abril, 2025',
    readTime: '3 min',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    featured: false,
  },
  {
    slug: 'eps-sura-montera-implementa-tuturno',
    title: 'EPS Surà Montería reduce tiempos de espera en un 73%',
    excerpt: 'La primera entidad en implementar TuTurno reporta resultados tras 3 meses de uso.',
    category: 'Caso de éxito',
    categoryColor: 'emerald',
    author: 'Equipo TuTurno',
    date: '1 de abril, 2025',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    featured: false,
  },
  {
    slug: 'por-que-filas-fisicas-son-pasado',
    title: 'Por qué las filas físicas son cosa del pasado',
    excerpt: 'Análisis: la transformación digital de servicios ciudadanos en América Latina y el rol de la tecnología.',
    category: 'Opinión',
    categoryColor: 'amber',
    author: 'Keyner Ramírez',
    date: '22 de marzo, 2025',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    featured: false,
  },
  {
    slug: 'tecnologia-ws-tiempo-real',
    title: 'WebSockets vs polling: cómo entregamos tiempo real sin agotar la batería',
    excerpt: 'Detrás del tracker de turnos: arquitectura de comunicaciones en tiempo real con Nitro y crossws.',
    category: 'Ingeniería',
    categoryColor: 'rose',
    author: 'Keyner Ramírez',
    date: '10 de marzo, 2025',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    featured: false,
  },
]

const categoryColors: Record<string, string> = {
  violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
}

const featuredArticle = computed(() => articles.find((a) => a.featured))
const restArticles = computed(() => articles.filter((a) => !a.featured))
</script>

<template>
  <div class="min-h-[100dvh] flex flex-col selection:bg-indigo-500/30">
    <LandingHeader />

    <main class="flex-1 pt-24 lg:pt-32 pb-24">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">

        <!-- Hero -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-full text-xs font-medium text-zinc-400 uppercase tracking-wide mb-8">
            <Icon name="lucide:newspaper" class="w-3.5 h-3.5 text-violet-400" />
            Blog
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-white mb-6 tracking-tighter">
            Noticias y artículos
          </h1>
          <p class="text-lg text-zinc-400 max-w-xl mx-auto">
            Novedades, tips y casos de éxito sobre la transformación digital de servicios ciudadanos en Colombia.
          </p>
        </div>

        <!-- Featured article -->
        <NuxtLink
          v-if="featuredArticle"
          :to="`/blog/${featuredArticle.slug}`"
          class="block group mb-12"
        >
          <div class="glass rounded-3xl border border-white/[0.08] overflow-hidden hover:border-white/[0.14] transition-all duration-300">
            <div class="grid grid-cols-1 lg:grid-cols-2">
              <div class="relative h-64 lg:h-auto overflow-hidden">
                <img
                  :src="featuredArticle.image"
                  :alt="featuredArticle.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                >
                <div class="absolute inset-0 bg-gradient-to-r from-transparent to-[--bg-surface]/80 lg:block hidden" />
              </div>
              <div class="p-8 lg:p-12 flex flex-col justify-center">
                <div class="flex items-center gap-3 mb-4">
                  <span
                    class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border"
                    :class="categoryColors[featuredArticle.categoryColor]"
                  >
                    {{ featuredArticle.category }}
                  </span>
                  <span class="text-xs text-zinc-500 flex items-center gap-1">
                    <Icon name="lucide:clock" class="w-3 h-3" />
                    {{ featuredArticle.readTime }}
                  </span>
                </div>
                <h2 class="text-2xl lg:text-3xl font-display font-medium text-white mb-4 group-hover:text-[--color-primary-light] transition-colors">
                  {{ featuredArticle.title }}
                </h2>
                <p class="text-zinc-400 mb-6 leading-relaxed">{{ featuredArticle.excerpt }}</p>
                <div class="flex items-center gap-3">
                  <span class="text-sm text-zinc-500">{{ featuredArticle.author }}</span>
                  <span class="text-zinc-600">·</span>
                  <span class="text-sm text-zinc-500">{{ featuredArticle.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>

        <!-- Article grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="article in restArticles"
            :key="article.slug"
            :to="`/blog/${article.slug}`"
            class="group"
          >
            <div class="glass rounded-2xl border border-white/[0.08] overflow-hidden h-full flex flex-col hover:border-white/[0.14] transition-all duration-300">
              <div class="relative h-48 overflow-hidden">
                <img
                  :src="article.image"
                  :alt="article.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                >
              </div>
              <div class="p-6 flex-1 flex flex-col">
                <div class="flex items-center gap-2 mb-3">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border"
                    :class="categoryColors[article.categoryColor]"
                  >
                    {{ article.category }}
                  </span>
                  <span class="text-xs text-zinc-500 flex items-center gap-1">
                    <Icon name="lucide:clock" class="w-3 h-3" />
                    {{ article.readTime }}
                  </span>
                </div>
                <h3 class="font-semibold text-white mb-2 group-hover:text-[--color-primary-light] transition-colors line-clamp-2">
                  {{ article.title }}
                </h3>
                <p class="text-sm text-zinc-400 flex-1 line-clamp-2">{{ article.excerpt }}</p>
                <div class="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.06]">
                  <span class="text-xs text-zinc-500">{{ article.author }}</span>
                  <span class="text-zinc-600">·</span>
                  <span class="text-xs text-zinc-500">{{ article.date }}</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Newsletter -->
        <div class="mt-20 glass rounded-3xl border border-white/[0.08] p-10 lg:p-14 text-center">
          <div class="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-6">
            <Icon name="lucide:bell" class="w-8 h-8 text-violet-400" />
          </div>
          <h2 class="text-2xl sm:text-3xl font-semibold text-white mb-3">Suscríbete al newsletter</h2>
          <p class="text-zinc-400 mb-8 max-w-md mx-auto">Recibe las últimas noticias de TuTurno directamente en tu correo.</p>
          <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" @submit.prevent>
            <input
              type="email"
              placeholder="tu@correo.com"
              class="flex-1 px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[--color-primary] transition-all"
            >
            <button type="submit" class="btn btn-primary px-6 py-3.5">
              Suscribirse
            </button>
          </form>
        </div>

      </div>
    </main>

    <LandingFooter />
  </div>
</template>