<template>
    <div class="taskRule">
        <div class="content">
            <p class="title">任务规则 <Button :type="(state === 'read') ? 'primary' : 'success'" @click="handleTaskRule" style="float: right;">{{(state === 'read') ? '修改' : '保存'}}</Button></p>
            <Divider />
            <textarea name="taskRule" id="taskRule" cols="30" rows="10" :maxlength="3000" v-model="task_rule_content" style="width: 100%; border-radius: 5px; height: 550px;" :style="{backgroundColor: ((state !== 'read') ? '#FFFFFF' : '#F3F3F3')}" :disabled="state === 'read'"></textarea>
        </div>
    </div>
</template>

<script>
    import api from '../../libs/API'
    export default {
        name: "TaskRule",
        data() {
            return {
                task_rule_content: '',
                state: 'read'
            }
        },
        methods: {
            query_task_rule() {
                const _this = this;
                _this.$Spin.show();
                api.post('query_task_rule').then(res => {
                    //console.log(res);
                    _this.$Spin.hide();
                    _this.task_rule_content = res.data.memo;
                }).catch(err => {
                    //console.error(err);
                    _this.$Spin.hide();
                    _this.$Message.error({
                        content: err.message || '任务规则查询失败',
                        duration: 3
                    });
                })
            },
            handleTaskRule() {
                const _this = this;
                if (_this.state === 'read') {
                    _this.state = 'save';
                } else {
                    _this.$Spin.show();
                    api.post('save_task_rule', null, {
                        memo: _this.task_rule_content
                    }).then(res => {
                        //console.log(res);
                        _this.$Spin.hide();
                        _this.$Spin.hide();
                        _this.state = 'read';
                        _this.$Message.success({
                            content: '任务规则保存成功',
                            duration: 3
                        });
                    }).catch(err => {
                        //console.error(err);
                        _this.$Spin.hide();
                        _this.$Message.error({
                            content: err.message || '任务规则保存失败',
                            duration: 3
                        });
                    })
                }
            }
        },
        created() {
            this.query_task_rule();
        }
    }
</script>

<style scoped lang="less">
    .taskRule {
        .content {
            textarea {
                padding: 5px 7px;
                border-radius: 5px;
                border-color: #ddd;
                color: #515a6e;
            }
            textarea::-webkit-input-placeholder {
                color: #c5c8ce;
            }
            textarea:-moz-placeholder {
                color: #c5c8ce;
            }
            textarea::-moz-placeholder {
                color: #c5c8ce;
            }
            textarea:-ms-input-placeholder {
                color: #c5c8ce;
            }
        }
    }
</style>