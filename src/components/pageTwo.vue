<template>
  <el-form-item label="容器镜像">
    <el-input
      v-model="mirror"
      placeholder="搜索容器镜像"
      @keyup.enter="onMirrorSearch(mirror)"
      @change="onMirrorChange"
    >
      <template #append>
        <el-button :icon="Search" @click="onMirrorSearch(mirror)" />
      </template>
    </el-input>
  </el-form-item>
  <el-form-item label="容器标签">
    <el-select
      v-model="tag"
      filterable
      remote
      :disabled="tagDis"
      placeholder="请选择标签"
      remote-show-suffix
      :loading="searchLoading"
      @click="onTagSearch"
    >
      <el-option
        v-for="item in tagSearchList"
        :key="item"
        :label="item"
        :value="item"
      ></el-option>
    </el-select>
  </el-form-item>
  <div>
    <el-descriptions
      v-for="item in mirrorSearchList"
      :key="item.name"
      :title="item.name"
      :column="3"
      size="small"
      border
      @click="onItemClick(item.name)"
    >
      <el-descriptions-item label="容器名" min-width="60">{{
        item.name
      }}</el-descriptions-item>
      <el-descriptions-item label="收藏数" width="60">{{
        item.star_count
      }}</el-descriptions-item>
      <el-descriptions-item label="是否官方" width="70">{{
        item.official
      }}</el-descriptions-item>
      <el-descriptions-item label="描述"
        >{{ item.description }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch } from "@vue/runtime-core";
import { Search } from "@element-plus/icons-vue";
import { imageSearch, tagSearch } from "@/request/api";
import { ElLoading } from "element-plus";
import { useMain } from "@/store/home";
import { IRuleForm } from "./TestCart.vue";
interface IMirror {
  official: Boolean | string;
  trusted: null;
  star_count: Number;
  is_official: Boolean;
  is_trusted: null;
  name: string;
  description: string;
  is_automated: Boolean;
}
export default defineComponent({
  emits: ["valueChange"],
  props: {
    image: {
      type: String,
    },
    item: {
      type: Object,
    },
  },
  setup({ image, item }, { emit }) {
    //pinia

    const store = useMain();
    const mirror = ref("");
    const tag = ref("");
    const tagDis = ref(true);
    if ((store.ruleForm as IRuleForm).image) {
      const array = (store.ruleForm as IRuleForm).image.split(":");
      mirror.value = array[0];
      tag.value = array[1];
    }
    if (image) {
      const arr = image.split(":");
      mirror.value = arr[0];
      tag.value = arr[1];
    }
    //搜索
    const searchLoading = ref(false);
    const mirrorSearchList: Ref<Array<IMirror>> = ref([]);
    const onMirrorSearch = (e: string) => {
      let List: Array<IMirror> = [];
      const loading = ElLoading.service({
        lock: true,
        background: "rgba(0, 0, 0, 0.3)",
      });
      imageSearch(e).then((res) => {
        List = res.data.data;
        List.map((v: IMirror) => {
          v.official ? (v.official = "是") : (v.official = "否");
        });
        mirrorSearchList.value = List;
        loading.close();
      });
    };
    const tagSearchList: Ref<Array<string>> = ref([]);
    const onTagSearch = () => {
      searchLoading.value = true;
      tagSearch(mirror.value).then((res) => {
        tagSearchList.value = res.data.data;
        searchLoading.value = false;
      });
    };
    //点击
    const onMirrorChange = () => {
      tag.value = "";
      tagDis.value = true;
    };
    const onItemClick = (name: string) => {
      mirror.value = name;
      tag.value = "";
      tagDis.value = false;
      mirrorSearchList.value = [];
    };
    watch([() => mirror.value, () => tag.value], () => {
      emit("valueChange", item, mirror.value, tag.value);
    });
    return {
      Search,
      mirror,
      tag,
      tagDis,
      onMirrorSearch,
      onTagSearch,
      searchLoading,
      mirrorSearchList,
      tagSearchList,
      onMirrorChange,
      onItemClick,
    };
  },
});
</script>

<style>
.el-descriptions {
  margin: 30px 10px;
  cursor: pointer;
  padding: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>