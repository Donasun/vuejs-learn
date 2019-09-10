<template>
  <div class="col-md-9 left-col pull-right">
    <div class="panel article-body content-body">
      <h1 class="text-center">{{ title }}</h1>
      <div class="article-meta text-center">
        <i class="fa fa-clock-o"></i>
        <abbr>{{ date | moment('from', { startOf: 'minute' }) }}</abbr>
      </div>
      <div class="entry-content">
        <div class="content-body entry-content panel-body">
          <div class="markdown-body" v-html="content"></div>

          <div v-if="auth && uid === 1" class="panel-footer operate">
            <div class="actions">
              <a @click="deleteArticle" class="admin" href="javascript:;">
                <i class="fa fa-trash-o"></i>
              </a>
              <a @click="editArticle" class="admin" href="javascript:;">
                <i class="fa fa-pencil-square-o"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 点赞 -->
    <div class="votes-container panel panel-default padding-md">
      <div class="panel-body vote-box text-center">
        <div class="btn-group">
          <a
            @click="like"
            href="javascript:;"
            class="vote btn btn-primary popover-with-html"
            :class="likeClass"
          >
            <i class="fa fa-thumbs-up"></i>
            {{ likeClass ? '已赞' : '点赞' }}
          </a>
          <div class="or"></div>
          <button @click="showQrcode = true" class="btn btn-success">
            <i class="fa fa-heart"></i> 打赏
          </button>
        </div>
        <div class="voted-users">
          <div class="user-lists">
            <span v-for="(likeUser,index) in likeUsers" :key="index">
              <!-- 点赞用户是当前用户时，加上类 animated 和 swing 以显示一个特别的动画  -->
              <router-link
                :to="`/${likeUser.uname}`"
                tag="img"
                :src="likeUser.uavatar"
                class="img-thumbnail avatar avatar-middle"
                :class="{ 'animated swing' : likeUser.uid === 1 }"
              />
            </span>
          </div>
          <div v-if="!likeUsers.length" class="vote-hint">成为第一个点赞的人吧 😄</div>
        </div>
      </div>
    </div>

    <!-- 打赏弹窗 使用slot的模态组件，其本质是一个半成品-->
    <!-- :show.sync 是一个组合属性（监听+props） 监听内部update:show事件,通过父组件改变传递给子组件的props值 -->
    <Modal :show.sync="showQrcode" class="text-center">
      <div v-if="user" slot="title">
        <img :src="user.avatar" class="img-thumbnail avatar" width="48" />
      </div>
      <div>
        <p class="text-md">如果你想学习更多前端的知识，VuejsCaff.com 是个不错的开始</p>
        <div class="payment-qrcode inline-block">
          <h5>扫一扫打开 VuejsCaff.com</h5>
          <p>
            <qrcode-vue value="https://vuejscaff.com/" :size="160"></qrcode-vue>
          </p>
        </div>
      </div>
      <div slot="footer">
        <div class="text-center">祝你学习愉快 :)</div>
      </div>
    </Modal>

    <!-- 评论列表 -->
    <div class="replies panel panel-default list-panel replies-index">
      <div class="panel-heading">
        <div class="total">
          回复数量:
          <b>{{ comments.length }}</b>
        </div>
      </div>

      <div class="panel-body">
        <!-- transition-group 过渡组组件， tag props指明过渡对象  -->
        <transition-group id="reply-list" name="fade" tag="ul" class="list-group row">
          <li
            v-for="(comment,index) in comments"
            :key="comment.commentId"
            class="list-group-item media"
          >
            <!-- 列表头部 -->
            <div class="avatar avatar-container pull-left">
              <router-link :to="`/${comment.uname}`">
                <img :src="comment.uavatar" class="media-object img-thumbnail avatar avatar-middle" />
              </router-link>
            </div>
            <!-- 评论展现 -->
            <div class="infos">
              <div class="media-heading">
                <router-link
                  :to="`/${comment.uname}`"
                  class="remove-padding-left author rm-link-color"
                >{{ comment.uname }}</router-link>
                <span v-if="auth" class="operate pull-right">
                  <span v-if="comment.uid===1">
                    <a href="javascript:;" @click="editComment(comment.commentId, index)">
                      <i class="fa fa-edit"></i>
                    </a>
                    <span>⋅</span>
                    <a href="javascript:;" @click="deleteComment(comment.commentId)">
                      <i class="fa fa-trash-o"></i>
                    </a>
                  </span>
                </span>
                <div class="meta">
                  <!-- 评论锚点 -->
                  <a
                    :id="`reply${index + 1}`"
                    :href="`#reply${index + 1}`"
                    class="anchor"
                  >#{{ index + 1 }}</a>
                  <span>⋅</span>
                  <!-- 时间过滤器,涉及到变参函数 -->
                  <abbr class="timeago">{{ comment.date | moment('from', {'startOf':'second'})}}</abbr>
                </div>
              </div>
              <!-- markdown呈现 -->
              <div class="preview media-body markdown-reply markdown-body" v-html="comment.content"></div>
            </div>
          </li>
        </transition-group>
        <div v-show="!comments.length" class="empty-block">暂无评论~~</div>
      </div>
    </div>

    <!-- 评论框 -->
    <div id="reply-box" class="reply-box form box-block">
      <!-- 评论编辑 -->
      <div class="form-group comment-editor">
        <textarea id="editor" v-if="auth"></textarea>
        <textarea
          v-else
          disabled
          class="form-control"
          placeholder="需要登录后才能发表评论."
          style="height:172px"
        ></textarea>
      </div>
      <!-- 评论提交 -->
      <div class="form-group reply-post-submit">
        <button
          id="reply-btn"
          class="btn btn-primary"
          :disabled="!auth"
          @click="comment"
        >{{ commentId ? '保存编辑' : '回复' }}</button>
        <span
          v-show="commentId"
          class="help-inline btn-cancel"
          style="cursor:pointer"
          @click="cancelEditComment"
        >取消编辑</span>

        <span v-show="!commentId" class="help-inline">Ctrl+Enter</span>
      </div>
      <!-- 编辑预览 -->
      <div
        v-show="commentHtml"
        id="preview-box"
        class="box preview markdown-body"
        v-html="commentHtml"
      ></div>
    </div>
  </div>
</template>

<script>
import SimpleMDE from "simplemde";
import hljs from "highlight.js";
// 可爱小表情
import emoji from "node-emoji";
import { mapState } from "vuex";
// 二维码组件
import QrcodeVue from "qrcode.vue";

export default {
  name: "Content",
  components: {
    QrcodeVue
  },
  data() {
    return {
      title: "", // 文章标题
      content: "", // 文章内容
      date: "", // 创建时间
      uid: 1, // 用户 ID
      likeUsers: [], // 点赞用户列表
      likeClass: "", // 点赞样式
      showQrcode: false, // 是否显示打赏弹窗
      commentHtml: "",
      comments: [],
      commentId: undefined
    };
  },
  created() {
    const articleId = this.$route.params.articleId;
    const article = this.$store.getters.getArticleById(articleId);

    if (article) {
      let { uid, title, content, date, likeUsers, comments } = article;
      this.uid = uid;
      this.title = title;
      // 对原始数据进行解密
      this.content = SimpleMDE.prototype.markdown(
        emoji.emojify(content, name => name)
      );
      this.date = date;
      this.likeUsers = likeUsers || [];
      // 更新 likeClass，点赞用户列表包含当前用户时，赋值为 active，表示已赞
      this.likeCass = this.likeUsers.some(likeUser => likeUser.uid === 1)
        ? "active"
        : "";

      // 渲染文章的 comments
      this.renderComments(comments);

      //  回调内的代码，确保是在页面dom渲染完成之后执行
      this.$nextTick(() => {
        //  针对代码块进行高亮处理
        this.$el.querySelectorAll("pre code").forEach(el => {
          hljs.highlightBlock(el);
        });
      });
      this.articleId = articleId;
    }
  },
  computed: {
    ...mapState(["user", "auth"])
  },
  mounted() {
    if (this.auth) {
      window.hljs = hljs;
      const simplemde = new SimpleMDE({
        element: document.querySelector("#editor"),
        placeholder:
          "请使用 Markdown 格式书写 ;-)，代码片段黏贴时请注意使用高亮语法。",
        spellChecker: false,
        autoDownloadFontAwesome: false,
        // 不显示工具栏
        toolbar: false,
        // 不显示状态栏
        status: false,
        renderingConfig: {
          codeSyntaxHighlighting: true
        }
      });

      // 实现第三方库与组件之间的通信 库事件-->组件数据
      // 监听编辑器change事件，回调组件响应属性变更,编辑器实例上注册监听
      simplemde.codemirror.on("change", () => {
        this.commentMarkdown = simplemde.value();
        // 更新 commentHtml，我们先替换原内容中的 emoji 标识，然后使用 markdown 方法将内容转成 HTML
        this.commentHtml = simplemde.markdown(
          emoji.emojify(this.commentMarkdown, name => name)
        );
      });

      simplemde.codemirror.on("keyup", (codemirror, event) => {
        // 使用 Ctrl+Enter 时提交评论
        if (event.ctrlKey && event.keyCode === 13) {
          this.comment();
        } else if (this.commentId && event.keyCode === 27) {
          // esc健
          this.cancelEditComment();
        }
      });

      // 将编辑器添加到当前实例
      this.simplemde = simplemde;
    }
  },
  methods: {
    editArticle() {
      this.$router.push({
        name: "Edit",
        params: { articleId: this.articleId }
      });
    },
    deleteArticle() {
      this.$swal({
        text: "你确定要删除此内容吗?",
        confirmButtonText: "删除"
      }).then(res => {
        if (res.value) {
          this.$store.dispatch("post", { articleId: this.articleId });
        }
      });
    },
    //回调没有传参时，默认参数为事件对象
    like(e) {
      if (!this.auth) {
        this.$swal({
          text: "需要登录以后才能执行此操作。",
          confirmButtonText: "前往登录"
        }).then(res => {
          if (res.value) {
            this.$router.push("/auth/login");
          }
        });
      } else {
        const target = e.currentTarget;
        // 点赞按钮是否含有 active 类
        const active = target.classList.contains("active");
        const articleId = this.articleId;

        if (active) {
          this.likeClass = "";
          // 分发 like 事件取消赞，更新实例的 likeUsers 为返回的值
          this.$store.dispatch("like", { articleId }).then(() => {
            // 使用带用户信息的点赞用户
            this.likeUsers = this.recompute("likeUsers");
          });
        } else {
          // 添加已赞样式
          this.likeClass = "active animated rubberBand";
          this.$store.dispatch("like", { articleId, isAdd: true }).then(() => {
            this.likeUsers = this.recompute("likeUsers");
          });
        }
      }
    },

    comment() {
      if (this.commentMarkdown && this.commentMarkdown.trim() !== "") {
        // 通过参数的个数或类型的不同实现多态
        this.$store
          .dispatch("comment", {
            comment: { content: this.commentMarkdown },
            //  评论的文章id
            articleId: this.articleId,
            commentId: this.commentId
          })
          .then(this.renderComments); // 成功则响应回调渲染评论

        if (this.commentId) {
          this.cancelEditComment();
        } else {
          // 清空评论编辑内容
          this.simplemde.value("");
          // 将焦点重新聚集在回复按钮上
          document.querySelector("#reply-btn").focus();
          this.$nextTick(() => {
            const lastComment = document.querySelector(
              "#reply-list li:last-child"
            );
            //页面渲染完毕，将当前评论流动到页面的顶部
            if (lastComment) lastComment.scrollIntoView(true);
          });
        }
      }
    },
    renderComments(comments) {
      if (Array.isArray(comments)) {
        // 使用带用户信息的评论
        comments = this.recompute("comments");
        // 深拷贝
        const newComments = comments.map(comment => ({ ...comment }));
        for (let comment of newComments) {
          // 将评论内容从 Markdown 转成 HTML
          comment.content = SimpleMDE.prototype.markdown(
            emoji.emojify(comment.content, name => name)
          );
        }
        // 更新实例的 comments
        this.comments = newComments;
        // 将 Markdown 格式的评论添加到当前实例
        this.commentsMarkdown = comments;
      }
    },

    // 评论索引用来指示页面滚动的位置
    editComment(commentId, commentIndex) {
      const simplemde = this.simplemde;
      const codemirror = this.simplemde.codemirror;
      // markdown格式的所有评论
      const comments = this.commentsMarkdown;

      for (const comment of comments) {
        if (parseInt(comment.commentId) === parseInt(commentId)) {
          simplemde.value(comment.content);
          // 使编辑器获得焦点
          codemirror.focus();
          // 设置光标位置
          codemirror.setCursor(codemirror.lineCount(), 0);
          this.commentIndex = commentIndex + 1;
          this.commentId = commentId;
          break;
        }
      }
    },
    // 取消编辑评论
    cancelEditComment() {
      this.commentId = undefined;
      this.simplemde.value("");
      // 下次 DOM 更新后，将评论滚动回视图的顶部
      this.$nextTick(() => {
        if (this.commentIndex === undefined) return;
        const currentComment = document.querySelector(
          `#reply-list li:nth-child(${this.commentIndex})`
        );
        if (currentComment) {
          currentComment.scrollIntoView(true);
          currentComment.querySelector(".operate a").focus();
        }
      });
    },
    deleteComment(commentId) {
      this.$swal({
        text: "你确定要删除此评论吗?",
        confirmButtonText: "删除"
      }).then(res => {
        if (res.value) {
          this.$store
            .dispatch("comment", {
              commentId,
              articleId: this.articleId
            })
            .then(this.renderComments);
          this.cancelEditComment();
        }
      });
    },
    // 返回带用户信息的文章的某项属性
    recompute(key) {
      const articleId = this.$route.params.articleId;
      //console.log(key)
      // 基于 getters.computedArticles 的，包含用户信息
      const article = this.$store.getters.getArticleById(articleId);
      let arr;
      if (article) {
        // 获取文章的点赞或评论信息
        arr = article[key];
      }
      //console.log(arr)
      return arr || [];
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
