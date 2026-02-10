<template>
  <div class="panel-tab__content">
    <el-form size="small" label-width="90px" @submit.prevent>
      <el-form-item v-if="false" label="ID">
        <el-input
          v-model="elementBaseInfo.id"
          :disabled="true"
          clearable
          @change="updateBaseInfo('id')"
        />
      </el-form-item>
      <el-form-item label="名称">
        <el-input
          v-model="elementBaseInfo.name"
          clearable
          @change="updateBaseInfo('name')"
        />
      </el-form-item>
      <!--流程的基础属性-->
      <template v-if="elementBaseInfo.$type === 'bpmn:Process'">
        <el-form-item v-if="false" label="版本标签">
          <el-input
            v-model="elementBaseInfo.versionTag"
            clearable
            @change="updateBaseInfo('versionTag')"
          />
        </el-form-item>
        <el-form-item v-if="false" label="可执行">
          <el-switch
            v-model="elementBaseInfo.isExecutable"
            active-text="是"
            inactive-text="否"
            @change="updateBaseInfo('isExecutable')"
          />
        </el-form-item>
        <el-form-item label="流程分类">
          <el-select v-model="categoryInfo" clearable @change="categoryChange">
            <el-option
              v-for="item in categoryList"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      <el-form-item
        v-if="elementBaseInfo.$type === 'bpmn:SubProcess'"
        label="状态"
      >
        <el-switch
          v-model="elementBaseInfo.isExpanded"
          active-text="展开"
          inactive-text="折叠"
          @change="updateBaseInfo('isExpanded')"
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import { category } from "@/api/bpm/definition";
export default {
  name: "ElementBaseInfo",
  props: {
    businessObject: Object,
    type: String,
    idEditDisabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      elementBaseInfo: {
        id: "",
        name: "",
        versionTag: "",
        isExecutable: "",
        isExpanded: "",
      },
      categoryInfo: "",
      categoryList: [],
    };
  },
  activated() {
    //console.log(this.rowEdit, 'this.rowEdit');
    this.elementBaseInfo.name = this.rowEdit.name;
    this.categoryInfo = this.rowEdit.category;
    this.$store.dispatch("flow/setCategory", this.categoryInfo);
  },
  mounted() {
    this.getCategory();
  },
  watch: {
    businessObject: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.$nextTick(() => this.resetBaseInfo());
        }
      },
    },
    elementBaseInfo: {
      handler: function (val) {
        if (val) {
          localStorage.setItem("categoryName", val.name);
        }
      },
      deep: true,
    },
    // categoryInfo: {
    //   handler: function(val) {
    //     //console.log(val, 'val999999');
    //   },
    //   immediate: true,deep: true
    // }
  },
  computed: {
    rowEdit() {
      return this.$store.getters.rowEdit;
    },
  },
  methods: {
    // 获取流程类型
    getCategory() {
      category().then((res) => {
        res.data.map((v) => {
          const obj = {
            name: v.categoryName + "-" + v.content,
            value: v.categoryName + "-" + v.content,
          };
          this.categoryList.push(obj);
        });
      });
    },
    resetBaseInfo() {
      this.bpmnElement = window.bpmnInstances?.bpmnElement || {};
      this.elementBaseInfo = JSON.parse(
        JSON.stringify(this.bpmnElement?.businessObject)
      );
      if (
        this.elementBaseInfo &&
        this.elementBaseInfo.$type === "bpmn:SubProcess"
      ) {
        this.elementBaseInfo["isExpanded"] =
          this.elementBaseInfo.di?.isExpanded;
      }
    },
    updateBaseInfo(key) {
      if (key === "id") {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          id: this.elementBaseInfo[key],
          di: { id: `${this.elementBaseInfo[key]}_di` },
        });
        return;
      }
      if (key === "isExpanded") {
        window?.bpmnInstances?.modeling.toggleCollapse(this.bpmnElement);
        return;
      }
      const attrObj = Object.create(null);
      attrObj[key] = this.elementBaseInfo[key];
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, attrObj);
    },
    //  流程分类的值
    categoryChange(val) {
      //console.log(val, 'valvalvalvlalvlavlavlav');
      if (val) {
        localStorage.setItem("categoryId", val);
        // 保存流程定义的流程分类
        this.$store.dispatch("flow/setCategory", val);
      }
    },
  },
  beforeUnmount() {
    this.bpmnElement = null;
  },
};
</script>
