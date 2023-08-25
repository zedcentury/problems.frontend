<template>
  <nav class="text-bg-light font-monospace py-2 text-center d-flex flex-column">
    <span class="text-uppercase fs-3">Problems</span>
    <small>by programming</small>
  </nav>

  <div class="container-md mt-3 mt-md-4 mt-lg-5">
    <div class="row">
      <div class="col-12 offset-0 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
        <select v-model="selectedTopic" @change="onSelectTopic" class="form-select" :disabled="loading.topics.value">
          <option selected value="0">All</option>
          <option v-for="topic in topics" :value="topic.id">{{ topic.title }}</option>
        </select>

        <p v-if="loading.problems.value" class="text-center mt-3 mt-md-4 mt-lg-5">Loading problems...</p>
        <table v-else class="table table-striped table-bordered mt-3 mt-md-4 mt-lg-5">
          <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Question</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="problem in problems" :key="problem.id">
            <th scope="row"># {{ problem.id }}</th>
            <td>{{ problem.content }}</td>
          </tr>
          </tbody>
          <tfoot v-if="problems.length === 0" class="text-center">
          <tr>
            <td colspan="2">Problems not found</td>
          </tr>
          </tfoot>
        </table>

        <div class="d-flex mt-3 mt-md-4 mt-lg-5">
          <button v-if="previous" @click="onPrevious" class="btn btn-secondary me-auto">Previous</button>
          <button v-if="next" @click="onNext" class="btn btn-secondary ms-auto">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default defineNuxtComponent({
  async setup() {
    const runtimeConfig = useRuntimeConfig()

    const route = useRoute()
    const topics = await useFetch(`${runtimeConfig.public.BASE_URL}/api/topic/list/`).then(response => response.data)
    const response = await useFetch(`${runtimeConfig.public.BASE_URL}/api/problem/list/`, {
      params: {
        topic: route.query.topic ? route.query.topic : undefined
      }
    }).then(response => response.data)
    return {
      topics: topics,
      problems: response.value.results,
      previous: response.value.previous,
      next: response.value.next
    }
  },
  mounted() {
    this.selectedTopic = this.$route.query.topic ? parseInt(this.$route.query.topic) : 0
  },
  data() {
    return {
      loading: {
        topics: false,
        problems: false
      },
      selectedTopic: 0
    }
  },
  methods: {
    async onSelectTopic(event) {
      this.loading.problems = true

      const runtimeConfig = useRuntimeConfig()

      await this.$router.push({
        name: 'index',
        query: {topic: event.target.value === '0' ? undefined : event.target.value}
      })
      const response = await useFetch(`${runtimeConfig.public.BASE_URL}/api/problem/list/`, {
        params: {
          topic: this.$route.query.topic === '0' ? undefined : this.$route.query.topic
        }
      }).then(response => response.data)

      this.problems = response.value.results
      this.previous = response.value.previous
      this.next = response.value.next

      this.loading.problems = false
    },
    async onPrevious() {
      if (!this.previous) {
        return
      }

      this.loading.problems = true

      const response = await useFetch(this.previous.toString(), {
        params: {
          topic: this.selectedTopic.toString() === '0' ? undefined : this.selectedTopic
        }
      }).then(response => response.data)

      this.problems = response.value.results
      this.previous = response.value.previous
      this.next = response.value.next

      this.loading.problems = false
    },
    async onNext() {
      if (!this.next) {
        return
      }

      this.loading.problems = true

      const response = await useFetch(this.next.toString(), {
        params: {
          topic: this.selectedTopic.toString() === '0' ? undefined : this.selectedTopic
        }
      }).then(response => response.data)

      this.problems = response.value.results
      this.previous = response.value.previous
      this.next = response.value.next

      this.loading.problems = false
    }
  }
})
</script>
