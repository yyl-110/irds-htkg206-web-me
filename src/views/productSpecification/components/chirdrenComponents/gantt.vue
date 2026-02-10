<script setup lang="ts">
import { onMounted, ref, defineProps, defineExpose, nextTick, watch } from 'vue';
import { gantt } from 'dhtmlx-gantt'; // 引入dhtmlx-gantt
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'; // 导入Gantt图CSS
const props = defineProps({
  tasks: {
    type: Object,
    default: () => {
      return {
        data: [], // 数据数组
        links: [], // 连接关系
      };
    },
  },
  // 显示列设置
  columns: {
    type: Array,
    default: () => {
      return [];
    },
  },
  // 显示单位
  scaleUnit: {
    type: String,
    default: 'month', // “minute”, “hour”, “day”, “week”, “quarter”, “month”, “year”
  },
  // 时间显示格式
  dateScale: {
    type: String,
    default: '%Y-%m', // 仅显示年份和月份
  },
});
const ganttRef = ref();
const isInitialized = ref(false);

// One-time setup
function setupGantt() {
  // Default configuration
  gantt.config.row_height = 42; // 设置内容行高
  gantt.config.bar_height = 20; // 设置进度条高度
  gantt.config.scale_cell = 80; // 设置进度条高度
  gantt.config.xml_date = '%Y-%m-%d';
  gantt.config.open_tree_initially = true;
  gantt.config.readonly = true; // 设置为只读
  gantt.i18n.setLocale('cn'); // 设置中文

  // 设置时间轴为仅显示年份和月份 - 使用正确的属性名 'format' 而不是 'date'
  gantt.config.scales = [
    { unit: props.scaleUnit, step: 1, format: props.dateScale }
  ];
  // 锁定缩放级别为月，防止显示日
  gantt.config.min_scale = props.scaleUnit;
  gantt.config.max_scale = props.scaleUnit;
  // 设置日期解析格式
  gantt.config.xml_date = '%Y-%m-%d';

  const ganttColumns = props.columns.map(col => {
    const column = {
      name: col.dataIndex, 
      label: col.title,
      width: col.width, 
      align: 'left', 
      tree: col.dataIndex === props.columns[0].dataIndex 
    };
    
    // 为状态列添加映射和样式
    if (col.dataIndex === 'status') {
      column.template = function(task) {
        switch (task.status) {
          case 0: return '<span>待启动</span>';
          case 1: return '<span style="color: #e6a23c">工作中</span>';
          case 2: return '<span>变更中</span>';
          case 3: return '<span style="color: #67c23a">已完成</span>';
          default: return '';
        }
      };
    }
    
    return column;
  });
  gantt.config.columns = ganttColumns;

  gantt.config.lightbox.sections = [
    { name: 'description', height: 38, map_to: 'text', type: 'textarea', focus: true },
    { name: 'time', height: 72, type: 'duration', map_to: 'auto' },
  ];

  // tooltips样式设置
  gantt.plugins({ tooltip: true });
  // 设置tooltip内容模板 - 极简版本以确保不影响渲染
  gantt.templates.tooltip_text = function(start, end, task) {
    return 'Task: ' + (task ? task.text : 'Unknown');
  };
  // 激活列表展开、折叠功能
  gantt.config.open_split_tasks = true;

  gantt.attachEvent('onTemplatesReady', () => {
    const rightPanel = document.querySelector('.timeline_cell');
    if (rightPanel) {
      rightPanel.style.width = '300px'; // 设置新的宽度
    }
  });

  // 初始化Gantt到容器
  gantt.init(ganttRef.value);

  gantt.templates.grid_folder = function (item) {
    var str = ''
    if (item.nodeType == '设计阶段') {
      if (item.$open) {
        str = `<div class="gantt_tree_style_open"></div>`
      } else {
        str = `<div class="gantt_tree_style_close"></div>`
      }
    } else {
      if (item.$open) {
       str = `<div class="gantt_tree_icon gantt_folder_closed"></div>`
      } else {
       str = `<div class="gantt_tree_icon gantt_folder_open"></div>`
      }
    }
    return str
  };

  gantt.config.details_on_create = true;

  gantt.config.autofit = true;

  gantt.config.resize_rows = true;

  gantt.config.order_branch = true;

  gantt.init(ganttRef.value);
}

 function parseData(tasks) {
   gantt.clearAll();

   function flattenData(data: any[], parentId: number = 0): any[] {
    return data.reduce((acc: any[], item: any) => {
       const flattenedItem = {
        ...item,
        parent: parentId
      };

       acc.push(flattenedItem);

       if (item.children && item.children.length > 0) {
        const children = flattenData(item.children, item.id);
        acc.push(...children);
      }

       delete flattenedItem.children;

      return acc;
    }, []);
  }
 
  const flattenedData = flattenData(tasks.data || []);
  const mappedData = flattenedData.map(task => ({
    ...task,
    text: task.nodeName,  
    start_date: task.actualStartTime,  
    end_date: task.actualEndTime,  
    progress: task.status / 3 || 0 
  }));
 
  const mappedTasks = {
    data: mappedData,
    links: tasks.links || []
  };
 
  gantt.parse(mappedTasks);
}
 
function initData() {
  if (!isInitialized.value) {
    setupGantt();
    isInitialized.value = true;
  }

   parseData(props.tasks);
}

 watch(
  () => props.tasks,
  (newTasks) => {
    if (isInitialized.value) {
       parseData(newTasks);
    }
  },
  { deep: true }
);

onMounted(() => {
  nextTick(() => {
    initData();
    // 调试：检查甘特图是否已初始化
    console.log('Gantt initialized:', isInitialized.value);
    // 调试：检查是否有任务数据
    console.log('Tasks data:', props.tasks);
    // 调试：检查甘特图容器
    console.log('Gantt container:', ganttRef.value);
  });
});

 defineExpose({ initData });
</script>

<template>
    <div ref="ganttRef" style="height: 600px;"></div>
</template>

<style lang="less" scoped>


:deep(.gantt_grid_scale) {
  height: 42px !important;
  line-height: 42px !important;
  background: #f8f8f8;
}
:deep(.gantt_task_scale) {
  height: 42px !important;
  line-height: 42px !important;
  background: #f8f8f8;
  width: 5000px !important;
}
:deep(.gantt_scale_line) {
  height: 42px !important;
  line-height: 42px !important;
  background: #f8f8f8;
}
:deep(.gantt_grid_head_cell) {
  color: #000;
  font-size: 14px;
  font-weight: 600;
  height: 42px;
}
:deep(.gantt_scale_cell) {
  color: #000 !important;
  font-size: 14px;
  font-weight: 600;
  // height: 42px !important;
  // width: 80px !important;
}
:deep(.gantt_tree_content) {
  color: #0d0909;
  font-size: 14px;
}
:deep(.gantt_task_line){
  background-color: #e86565;
}
:deep(.gantt_tree_style_open) {
  margin-left: 5px;
  margin-top: 10px;
  background:url('../../../../../assets/images//设计阶段.png') no-repeat 0 3px ;
  content:'';
  display: block;
  width: 20px;
  height: 22px;
  font-size: 18px;
  background-size:18px;
}
:deep(.gantt_tree_style_close) {
  margin-left: 5px;
  margin-top: 10px;
  background:url('../../../../../assets/images//设计阶段.png') no-repeat 0 3px ;
  content:'';
  display: block;
  width: 20px;
  height: 22px;
  font-size: 18px;
  background-size:18px;
}
 
</style>