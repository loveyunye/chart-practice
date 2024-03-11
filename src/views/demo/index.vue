<template>
  <div>
    
  </div>
</template>
<script>
import http from '@/api/http';
export default {
  name: 'ChartPracticeIndex',

  data() {
    return {
      
    };
  },

  mounted() {
    http({
      url: '/api/system/captcha/get',
    }).then((res) => {
      console.log(res)
    })
  },

  methods: {
    
  },
};
</script>