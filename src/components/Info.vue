<template>
    <el-row :gutter="20" >
        <el-col :span="8">
            <div class="grid-content bg-purple">
                <div class="status">
                  
                </div>
            </div>
        </el-col>
        <el-col :span="8">
            <div class="grid-content bg-purple-light">
                <span>222</span>
            </div>
        </el-col>
        <el-col :span="8"><div class="grid-content bg-purple">3</div></el-col>
    </el-row>
</template>

<script>


export default {
  components:{
    
  },
  
}
</script>
<style lang="scss" scoped>
  .el-row {
    padding:40px 40px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
</style>