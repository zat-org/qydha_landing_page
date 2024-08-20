import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMyTabStore = defineStore("myTabStore",()=>{
const tabindex= ref (0)
const goto=(index:number)=>{
tabindex.value = index
}

return {tabindex,goto}
})
