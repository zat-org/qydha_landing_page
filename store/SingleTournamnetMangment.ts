import { defineStore } from 'pinia'

export const useSingleTournamnetMangmentStore = defineStore('singleTournamnetMangment', ()=>{
  
  const activeStep = ref(0)
  const setActiveStep = (step: number) => {
    activeStep.value = step
  }
  return { activeStep, setActiveStep }
})
