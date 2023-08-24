<script setup>
let route = useRoute()
let router = useRouter()

// Declare loading variable for topics and problems
let loading = {
  topics: ref(false),
  problems: ref(false)
}

// Declare selectedTopic variable
let selectedTopic = ref(route.query.topic ? route.query.topic : 0)

// Get topics
loading.topics.value = true
const topics = await useFetch('http://localhost:8000/api/topic/list/').then(response => response.data)
loading.topics.value = false

// Get problems
loading.problems.value = true
let {data} = await useFetch('http://localhost:8000/api/problem/list/', {
  params: {
    topic: route.query.topic === '0' || route.query.topic === 0 ? undefined : route.query.topic
  }
})
let problems = ref(data.value['results'])
let previous = ref(data.value['previous'])
let next = ref(data.value['next'])
loading.problems.value = false

// Problems are got when topic is selected
const onSelectTopic = async (event) => {
  loading.problems.value = true
  let {data} = await useFetch('http://localhost:8000/api/problem/list/', {
    params: {
      topic: event.target.value === 0 || event.target.value === '0' ? undefined : event.target.value
    }
  })
  problems.value = data.value['results']
  previous.value = data.value['previous']
  next.value = data.value['next']
  loading.problems.value = false

  await router.push({
    name: 'index',
    query: {topic: selectedTopic.value === 0 || selectedTopic.value === '0' ? undefined : selectedTopic.value}
  })
}

// Get previous page problems
const onPrevious = async () => {
  if (!previous.value) {
    return
  }

  loading.problems.value = true
  let {data} = await useFetch(previous.value)
  problems.value = data.value['results']
  previous.value = data.value['previous']
  next.value = data.value['next']
  loading.problems.value = false
}

// Get next page problems
const onNext = async () => {
  if (!next.value) {
    return
  }

  loading.problems.value = true
  let {data} = await useFetch(next.value)
  problems.value = data.value['results']
  previous.value = data.value['previous']
  next.value = data.value['next']
  loading.problems.value = false
}
</script>


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
