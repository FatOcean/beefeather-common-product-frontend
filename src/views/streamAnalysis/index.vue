<template>
  <div class="stream-page-container">
    <el-page-header @back="goBack" content="流程分析"> </el-page-header>
    <div class="stream-page">
      <!-- 左侧：规则树 + 上传/删除 -->
      <div class="left-panel">
        <div class="tree-header">
          <h3>规则集合</h3>
        </div>

        <el-tree
          ref="ruleTree"
          class="rule-tree"
          :data="treeData"
          node-key="id"
          show-checkbox
          default-expand-all
          :props="treeProps"
          :expand-on-click-node="false"
          @check-change="onTreeCheckChange"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <template v-if="editingNodeId === data.id">
              <el-input
                size="mini"
                v-model="editInput"
                @keyup.enter.native="confirmEdit(data)"
                @blur="confirmEdit(data)"
              />
            </template>
            <template v-else>
              <span class="label">{{ data.label }}</span>
              <el-tooltip
                v-if="data.tooltip"
                effect="dark"
                :content="data.tooltip"
                placement="top"
              >
                <i class="el-icon-question help-icon"></i>
              </el-tooltip>
              <i
                v-if="node.level === 1"
                class="el-icon-edit edit-icon"
                @click.stop="startEdit(data)"
              ></i>
            </template>
          </span>
        </el-tree>

        <div class="actions">
          <el-button type="primary" @click="handleAdd" size="mini"
            >新增</el-button
          >
          <el-button
            type="danger"
            :disabled="!hasSelection"
            @click="handleDelete"
            size="mini"
            >删除</el-button
          >
        </div>
      </div>

      <!-- 右侧：问答区 -->
      <div class="right-panel">
        <div class="chat-box" ref="chatBox">
          <div v-for="(m, idx) in messages" :key="idx" :class="['msg', m.role]">
            <div class="bubble">
              {{ m.content }}
            </div>
          </div>
        </div>

        <div class="composer">
          <el-input
            type="textarea"
            v-model="inputText"
            :autosize="{ minRows: 2, maxRows: 8 }"
            placeholder="请输入问题..."
          />
          <!-- <div class="composer-footer"> -->
          <el-switch
            v-model="includeParsedContent"
            active-text="添加本次解析内容"
          />
          <el-button
            type="primary"
            circle
            icon="el-icon-top"
            size="small"
            @click="handleSend"
            :disabled="!inputText.trim()"
            title="发送"
          />
          <!-- </div> -->
        </div>
      </div>
    </div>
    <UploadDialog ref="uploadDialog" />
  </div>
</template>

<script>
import UploadDialog from "./uploadDialog.vue";
export default {
  name: "StreamAnalysis",
  components: { UploadDialog },
  data() {
    return {
      treeData: [
        {
          id: 1,
          label: "规则1",
          tooltip: "规则1的描述",
          children: [{ id: 2, label: "规则2" }],
        },
        {
          id: 3,
          label: "规则1",
          children: [{ id: 4, label: "规则2" }],
        },
        {
          id: 5,
          label: "规则1",
          children: [
            { id: 6, label: "规则2" },
            { id: 7, label: "规则3" },
          ],
        },
      ],
      treeProps: { label: "label", children: "children" },
      editingNodeId: null,
      editInput: "",
      jsonFiles: [],

      // chat
      messages: [],
      inputText: "",
      includeParsedContent: false,
      streamTimer: null,
      hasSelection: false,
    };
  },
  methods: {
    // ========== 树：选择变化 ==========
    onTreeCheckChange() {
      const tree = this.$refs.ruleTree;
      this.hasSelection = !!(
        tree &&
        tree.getCheckedKeys &&
        tree.getCheckedKeys().length > 0
      );
    },
    handleAdd() {
      this.$refs.uploadDialog.openDialog();
    },
    goBack() {
      this.$router.push({ name: "home" });
    },
    // ========== 树：编辑 ==========
    startEdit(data) {
      this.editingNodeId = data.id;
      this.editInput = data.label;
    },
    confirmEdit(data) {
      const value = (this.editInput || "").trim();
      if (value) data.label = value;
      this.editingNodeId = null;
      this.editInput = "";
    },

    // ========== 树：删除 ==========
    handleDelete() {
      const tree = this.$refs.ruleTree;
      if (!tree) return;
      const checked = tree.getCheckedKeys();
      if (!checked || checked.length === 0) return;
      this.treeData = this.removeNodesByIds(this.treeData, new Set(checked));
      this.hasSelection = false;
    },
    removeNodesByIds(list, idSet) {
      // 删除命中的节点；若父命中则整组删；否则递归 children
      const result = [];
      list.forEach((node) => {
        if (idSet.has(node.id)) return; // 整个节点删除
        const copy = { ...node };
        if (copy.children && copy.children.length) {
          copy.children = this.removeNodesByIds(copy.children, idSet);
        }
        result.push(copy);
      });
      return result;
    },

    // ========== 上传并解析 JSON ==========
    async fileUploadJson(files) {
      for (let i = 0; i < files.length; i++) {
        const fileItem = files[i];
        try {
          const file = fileItem.file;
          const text = await file.text();
          const json = JSON.parse(text);
          const groupName = (file.name || "未命名").replace(/\.json$/i, "");
          const groupNode = this.buildGroupFromJson(json, groupName);
          this.treeData.push(groupNode);
          fileItem.status = "success";
        } catch (e) {
          fileItem.status = "fail";
          fileItem.errorMsg = e.message || "解析失败";
          this.$message.error(fileItem.errorMsg);
        }
      }
    },
    buildGroupFromJson(json, groupName) {
      const id = this.generateUuid();
      const children = this.extractChildren(json);
      return {
        id,
        label: groupName,
        tooltip: `来自 ${groupName}.json，包含 ${children.length} 条规则`,
        children,
      };
    },
    extractChildren(json) {
      const children = [];
      if (Array.isArray(json)) {
        json.forEach((item, idx) => {
          if (typeof item === "string") {
            children.push({ id: this.generateUuid(), label: item });
          } else if (item && typeof item === "object") {
            const label = item.name || item.title || `规则${idx + 1}`;
            children.push({ id: this.generateUuid(), label });
          } else {
            children.push({ id: this.generateUuid(), label: `规则${idx + 1}` });
          }
        });
      } else if (json && typeof json === "object") {
        Object.keys(json).forEach((key) => {
          children.push({ id: this.generateUuid(), label: key });
        });
      }
      return children;
    },

    // ========== 问答发送 ==========
    handleSend() {
      const tree = this.$refs.ruleTree;
      const selected = tree ? tree.getCheckedNodes(true) : [];
      const payload = {
        question: this.inputText,
        includeParsedContent: this.includeParsedContent,
        selected: selected.map((n) => ({ id: n.id, label: n.label })),
      };
      // 用户消息
      this.messages.push({ role: "user", content: this.inputText });
      this.inputText = "";
      // 模拟流式输出
      this.startStreamReply(payload);
    },
    startStreamReply(payload) {
      const reply = `收到请求，选中 ${
        payload.selected.length
      } 项，添加解析内容：${payload.includeParsedContent ? "是" : "否"}。`;
      const msg = { role: "assistant", content: "" };
      this.messages.push(msg);
      let idx = 0;
      clearInterval(this.streamTimer);
      this.streamTimer = setInterval(() => {
        if (idx >= reply.length) {
          clearInterval(this.streamTimer);
          return;
        }
        msg.content += reply[idx++];
        this.$nextTick(() => this.scrollToBottom());
      }, 20);
    },
    scrollToBottom() {
      const el = this.$refs.chatBox;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    },

    // ========== 工具 ==========
    generateUuid() {
      if (typeof crypto !== "undefined" && crypto.getRandomValues) {
        const buf = new Uint8Array(16);
        crypto.getRandomValues(buf);
        buf[6] = (buf[6] & 0x0f) | 0x40;
        buf[8] = (buf[8] & 0x3f) | 0x80;
        const hex = [...buf].map((b) => b.toString(16).padStart(2, "0"));
        return (
          hex[0] +
          hex[1] +
          hex[2] +
          hex[3] +
          "-" +
          hex[4] +
          hex[5] +
          "-" +
          hex[6] +
          hex[7] +
          "-" +
          hex[8] +
          hex[9] +
          "-" +
          hex[10] +
          hex[11] +
          hex[12] +
          hex[13] +
          hex[14] +
          hex[15]
        );
      }
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
  },
  beforeDestroy() {
    clearInterval(this.streamTimer);
  },
};
</script>

<style scoped lang="stylus">
.stream-page-container {
  .el-page-header {
    height: 52px;
    line-height: 52px;
    padding: 0 12px;
    box-sizing: border-box;
    border-bottom: 1px solid #E5E7EC;
    background: #fff;
  }

  .stream-page {
    display: flex;
    gap: 12px;
    padding: 12px;
    height: calc(100vh - 70px);
    box-sizing: border-box;

    .left-panel {
      width: 320px;
      border: 1px solid #e5e7ec;
      border-radius: 8px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      background: #fff;
      height: 100%;

      .tree-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        h3 {
          margin: 0;
          font-size: 14px;
          color: #303133;
        }
      }

      .rule-tree {
        flex: 1;
        overflow: auto;
        border: 1px solid #f0f0f0;
        border-radius: 6px;
        padding: 6px;

        .custom-tree-node {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          width: 100%;
          font-size: 13px;

          .label {
            flex: none;
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      .help-icon {
        color: #909399;
        cursor: pointer;
        font-size: 14px;

        &:hover {
          color: #606266;
        }
      }

      .edit-icon {
        margin-left: auto;
        color: #606266;
        cursor: pointer;
        font-size: 14px;

        &:hover {
          color: #409EFF;
        }
      }
    }
  }
}

.stream-page .left-panel .actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.stream-page .right-panel {
  padding: 10%;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 100px 140px;
  padding-top: 60px;
  background: #fff;

  .chat-box {
    flex: 1;
    overflow: auto;
    border-radius: 6px;
    padding: 10px;

    .msg {
      margin-bottom: 8px;

      .bubble {
        display: inline-block;
        padding: 8px 10px;
        border-radius: 6px;
        background: #fff;
        border: 1px solid #eee;
      }
    }

    .user {
      text-align: right;
    }
  }

  .composer {
    position: relative;

    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;
    ::v-deep .el-textarea__inner {
      border-radius: 18px;
      padding-bottom: 30px;
      padding-right: 50px;
    }

    .composer-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    ::v-deep .el-button {
      position: absolute;
      right: 20px;
      top: 50%;
      padding: 4px;
      transform: translateY(-50%);

      &:.is-disabled {
        border-color: #ececec;
      }
    }

    .el-switch {
      position: absolute;
      bottom: 6px;
      left: 6px;

      &.is-checked {
        ::v-deep .el-switch__core {
          border-color: #009688;
          background-color: #009688;
        }

        ::v-deep .el-switch__label {
          color: #009688;
        }
      }
    }
  }
}
</style>