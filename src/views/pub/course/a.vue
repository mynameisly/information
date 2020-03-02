<template>
  <div class="traffic-editQuestion">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/examManage' }">试题库</el-breadcrumb-item>
      <el-breadcrumb-item>{{questionId ? '修改试题': '增加试题'}}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="traffic-editQuestion-box" v-loading="loading">
      <div class="traffic-editQuestion-form-choice">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
          <el-form-item label="试题分类" prop="questionType">
            <el-select v-model="formInline.questionType">
              <el-option v-for="(text,key) in questionType" :label="text" :value="key" :key="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="试题难度" prop="diffcult">
            <el-select v-model="formInline.diffcult">
              <el-option v-for="(text,key) in diffcult" :label="text" :value="key" :key="key"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div class="traffic-editQuestion-form-box">
        <el-form :model="form" ref="form" :rules="rules">

          <div class="traffic-editQuestion-stem">
            <div class="traffic-editQuestion-stemLeft">
              <el-button type="info" size="small">题干</el-button>
            </div>
            <div class="traffic-editQuestion-stemRight">
              <span>这里填写题干描述</span>
              <el-form-item prop="content">
                <el-input v-model.trim="form.content" class="traffic-editQuestion-stemRightInput" type="textarea" maxlength="300"
                          :autosize="{ minRows: 3, maxRows: 6}"  placeholder="请输入内容"  show-word-limit>
                </el-input>
              </el-form-item>
            </div>
          </div>

          <!-- 单选主体 -->
          <div class="traffic-editQuestion-option" v-if="formInline.questionType == '1'">
            <div class="traffic-editQuestion-optionLeft">
              <el-button type="info" size="small">选项</el-button>
            </div>
            <div class="traffic-editQuestion-optionRight">
              <span>单选题的选项范围从2-20</span>
              <el-form-item prop="answerList">
                <el-form-item v-for="(value,key,index) in answerOP" :key="key">
                  <el-radio class="traffic-editQuestion-optionRightInput" v-model="radio" :label="key">
                    <el-input placeholder="请输入内容" v-model.trim="answerOP[key]" maxlength="200"></el-input>
                  </el-radio>
                  <div class="icon-del" v-if="index > 1">
                    <i class="el-icon-error" @click="delOption(key)"></i>
                  </div>
                </el-form-item>
              </el-form-item>
              <el-form-item>
                <el-button class="traffic-editQuestion-add" type="info" @click="addOption()">+ 添加一个选项</el-button>
              </el-form-item>
            </div>
          </div>
          <!-- 多选主体 -->
          <div class="traffic-editQuestion-option"  v-if="formInline.questionType == '2'">
            <div class="traffic-editQuestion-optionLeft">
              <el-button type="info" size="small">选项</el-button>
            </div>
            <div class="traffic-editQuestion-optionRight">
              <span>多选题的选项范围从2-20</span>
              <el-form-item prop="answerList">
                <el-form-item v-for="(value,key,index) in answerOP" :key="key">
                  <el-checkbox class="traffic-editQuestion-optionRightInput traffic-editQuestion-optionRightCheckbox" v-model="checkList" :label="key">
                    <el-input placeholder="请输入内容" v-model.trim="answerOP[key]" required maxlength="200"></el-input>
                  </el-checkbox>
                  <div class="icon-del" v-if="index>1">
                    <i style="margin-left:30px" class="el-icon-error" @click="delOption(key)"></i>
                  </div>
                </el-form-item>
              </el-form-item>
              <el-form-item>
                <el-button class="traffic-editQuestion-add" type="info" @click="addOption()">+ 添加一个选项</el-button>
              </el-form-item>
            </div>
          </div>
          <!-- 判断主体部分 -->
          <div class="traffic-editQuestion-option" v-if="formInline.questionType == '3'">
            <div class="traffic-editQuestion-optionLeft">
              <el-button type="info" size="small">选项</el-button>
            </div>
            <div class="traffic-editQuestion-optionRight">
              <span>选择正确或者错误</span>
              <br/>
              <el-form-item class="traffic-editQuestion-judge" prop="radio1" required>
                <el-radio v-model="radioJudge" :label="0" border fill="#909399" size="small">正确</el-radio>
                <el-radio v-model="radioJudge" :label="1" border fill="#909399" size="small">错误</el-radio>
              </el-form-item>
            </div>
          </div>
          <!-- 填空主体部分 -->
          <div class="traffic-editQuestion-option" v-if="formInline.questionType == '4'">
            <div class="traffic-editQuestion-optionLeft">
              <el-button type="info" size="small">选项</el-button>
            </div>
            <div class="traffic-editQuestion-optionRight">
              <span>这里填写答案</span>
              <el-form-item prop="answerList">
                <el-form-item v-for="(value,key,index) in answerOP" :key="key">
                  <span class="traffic-editQuestion-index">{{index+1}}</span>
                  <el-input placeholder="请输入内容" v-model.trim="answerOP[key]" class="traffic-editQuestion-optionRightInput" maxlength="200"></el-input>
                  <div class="icon-del" v-if="index>0" style="margin-left: 10px;">
                    <i class="el-icon-error" @click="delOption(key)"></i>
                  </div>
                </el-form-item>
              </el-form-item>
              <el-form-item>
                <el-button class="traffic-editQuestion-add" type="info" @click="addOption()">+ 添加一个选项</el-button>
              </el-form-item>
              <el-form-item>
                <div @click="showPackDialog" class="optionRight-pack-group">设置乱序选项组</div>
                <el-tooltip placement="top" effect="dark">
                  <div slot="content">说明：每个选项组，选中的答案选项，对其答题顺序不做要求</div>
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </el-form-item>
            </div>
          </div>

          <div class="traffic-editQuestion-analysis">
            <div class="traffic-editQuestion-analysisLeft">
              <el-button type="info" size="small">解析</el-button>
            </div>
            <div class="traffic-editQuestion-analysisRight">
              <span>这里填写该问题对应的答案解释（非必填）</span>
              <el-input  v-model.trim="form.analysis" class="traffic-editQuestion-analysisRightInput" type="textarea" show-word-limit
                         maxlength="300"  :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入内容">
              </el-input>
            </div>
          </div>
          <br/>
          <div class="traffic-editQuestion-keeps">
            <div class="traffic-editQuestion-keepsRight">
              <div class="traffic-editQuestion-keep">
                <el-button type="primary" @click="questionClick()">保存</el-button>
              </div>
            </div>
          </div>

        </el-form>
      </div>
    </div>

    <!--填空题弹框-->
    <el-dialog class="optionRight-pack-add" title="设置乱序选项组" :visible.sync="dialogFormVisible"  :close-on-click-modal="false" :show-close="false">
      <el-form>
        <el-form-item  v-for="(item,i) in packList" :key=i>
          <span class="optionRight-pack-add-index">选项组{{i+1}}</span>
          <el-select class="optionRight-pack-select" multiple v-model="packList[i]">
            <el-option v-for="(value,key) in computedAnswer[i]" :key="key" :label="value" :value="key"></el-option>
          </el-select>
          <div class="icon-del-pack">
            <i class="el-icon-error" @click="delGroup(i)"></i>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="optionRight-pack-group" @click="addPack()">
            <p>添加选项组</p>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="surePackList">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 试题保存成功 -->
    <el-dialog :visible.sync="dialogVisible" width="50%" center :show-close="false">
      <div class="traffic-editPaper-success">
        <img src="../../assets/image/success.png" width="80"/>
        <h2>{{successMsg}}</h2>
        <span>是否继续录题</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="goBackList" size="medium">返回列表</el-button>
        <el-button type="primary" @click="addQuestion" size="medium">继续录题</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
    import qs from "qs";

    export default {
        name: "addQuestions",
        data() {
            let checkOptions = (rule, value, callback) => {
                for (let prop in this.answerOP) {
                    if (!this.answerOP[prop]) return callback(new Error("请输入试题选项"));
                }
                if (this.formInline.questionType == "2") {
                    if (this.checkList.length == 0) {
                        callback(new Error("请勾选选项答案"));
                    }
                } else if (this.formInline.questionType == '1') {
                    if (!this.radio) {
                        callback(new Error("请勾选选项答案"));
                    }
                }
                callback();
            };

            return {
                loading:false,
                questionId: this.$route.query.questionId || "",
                formInline: {
                    questionType: "1",
                    diffcult: "1"
                },
                diffcult: {},
                questionType: {},
                form: {
                    content: "",
                    analysis: ""
                },

                answerOP: {1: '', 2: '', 3: '', 4: ''},
                answerCount: 4,
                answerPackList:[[]],
                packList:[[]],

                dialogFormVisible:false,
                dialogVisible: false,
                checkList: [],
                radio: "",
                radioJudge:0,

                rules: {
                    content: [{required: true, message: "请输入题干", trigger: "blur"}],
                    answerList: [{validator: checkOptions, trigger: "blur"}],
                    radio1: [{required: true, message: "请选择选项", trigger: "blur"}]
                }
            };
        },
        created() {
            this.getQuestionDifficult();
            this.getQuestionType();
            this.questionsFindById();
        },
        computed: {
            computedAnswer(){
                let filterAnswer={};
                for(let i=0;i<this.packList.length;i++){
                    let otherOpArray = [];
                    filterAnswer[i] = {};
                    this.packList.forEach((item, index) => {
                        if (index != i) otherOpArray = otherOpArray.concat(item)

                    });
                    for (let prop in this.answerOP) {
                        if (!otherOpArray.includes(prop)) {
                            filterAnswer[i][prop] = this.answerOP[prop];
                        }
                    }
                }
                return filterAnswer;
            },
            successMsg() {
                return this.questionId ? "试题修改成功" : "试题保存成功";
            }
        },
        methods: {
            goBackList() {
                this.$router.push({path: '/examManage',query: {forceRefresh: true}})
            },
            addQuestion() {
                this.questionId=null;
                this.dialogVisible = false;
                this.form.content = "";
                this.form.analysis = "";

                this.answerOP = {1: '', 2: '', 3: '', 4: ''};
                this.answerCount = 4;
                this.answerPackList = [[]];
                this.packList = [[]];

                this.checkList = [];
                this.radio = "";
            },
            showPackDialog(){
               this.packList=[];
               for(let item of this.answerPackList){
                   this.packList.push([...item])
               }
               this.dialogFormVisible = true;
            },
            surePackList(){
                this.answerPackList=[];
                for(let item of this.packList){
                    this.answerPackList.push([...item])
                }
                this.dialogFormVisible = false;
            },
            delOption(index) {
                this.$delete(this.answerOP, index);
            },
            addOption() {
                if (Object.keys(this.answerOP).length == 20) return;
                this.answerCount++;
                this.$set(this.answerOP, this.answerCount, '');
            },
            addPack() {
                this.packList.push([]);
            },
            delGroup(index) {
                this.packList.splice(index, 1);
            },
            getQuestionDifficult() {
                this.$http.get("/public/getDiffcult").then(res => {
                    this.diffcult = res.data.content;
                }).catch(() => {
                });
            },
            getQuestionType() {
                this.$http.get("/public/getType").then(res => {
                    this.questionType = res.data.content;
                }).catch(() => {
                });
            },
            getQueParams() {
                let answerListArray = [];
                let {questionType} = this.formInline;
                if (questionType == '3') {
                    answerListArray.push({answerInfo: '正确', isTrue: this.radioJudge == 0 ? 1 : 0});
                    answerListArray.push({answerInfo: '错误', isTrue: this.radioJudge == 1 ? 1 : 0});
                } else if(questionType=='4'){
                    let answerArray = [], packListStr = {};
                    for (let i = 0; i < this.answerPackList.length; i++) {
                        this.answerPackList[i].forEach((item) => {
                            packListStr[item] = this.answerPackList[i].map((key) => {
                                return this.answerOP[key]
                            }).join('*');
                        })
                    }
                    for (let prop in this.answerOP) {
                        let str = packListStr[prop] || this.answerOP[prop];
                        answerArray.push(`${this.answerOP[prop]}:${str}`)
                    }
                    let answerStr = {answerInfo: `#${answerArray.join('#')}#`, isTrue: 1};
                    answerListArray.push(answerStr);
                }else{
                    for (let prop in this.answerOP) {
                        if (questionType == '1') {
                            let isTrue = this.radio == prop ? 1 : 0
                            answerListArray.push({answerInfo: this.answerOP[prop], isTrue})
                        } else if (questionType == '2') {
                            let isTrue = this.checkList.includes(prop) ? 1 : 0;
                            answerListArray.push({answerInfo: this.answerOP[prop], isTrue})
                        }
                    }
                }
                return answerListArray;
            },
            questionClick() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        this.updateAddQue();
                    } else {
                        return false;
                    }
                });
            },
            updateAddQue() {
                let answerListArray = this.getQueParams();
                const data = {
                    content: this.form.content,
                    questionType: this.formInline.questionType,
                    diffcult: this.formInline.diffcult,
                    analysis: this.form.analysis,
                    answerListStr: JSON.stringify(answerListArray)
                };

                let url = "/adque/add";

                if (this.questionId) {
                    data.questionId = this.questionId;
                    url = "/adque/update";
                }
                const options = {
                    method: "POST",
                    headers: {"content-type": "application/x-www-form-urlencoded"},
                    data: qs.stringify(data),
                    url: url
                };

                this.loading=true;
                this.$http(options).then(() => {
                    this.dialogVisible = true;
                }).catch((res) => {
                    this.$alert(res.data ? res.data.msg : "操作失败", "操作失败", {
                        type: "error",
                        confirmButtonText: "确定",
                        showClose: false
                    });
                }).finally(()=>{
                    this.loading=false;
                });
            },
            questionsFindById() {
                if (!this.questionId) return false;
                this.$http.get("/adque/findById", {
                    params: {
                        questionId: this.questionId
                    }
                }).then(response => {
                    let {questionType, diffcult, analysis, content, answerList,group} = response.data.content;
                    this.formInline.questionType = `${questionType}`;
                    this.formInline.diffcult = `${diffcult}`;
                    this.form.analysis = analysis;
                    this.form.content = content;

                    if (questionType == 3) {
                        let correct = answerList.filter((key) => {
                            return key.isTrue;
                        })
                        this.radioJudge = correct[0].answerInfo == '正确' ? 0 : 1
                    } else if (questionType == 4) {
                        let answerAry = group.trim().replace(/^#*|#*$/g,'').split('#');
                        let packList={};
                        for (let i = 1; i < answerAry.length + 1; i++) {
                            let anContent = answerAry[i-1].split(':');
                            this.$set(this.answerOP, i, anContent[0]);
                            if(anContent[0]!=anContent[1]){
                                if(packList[anContent[1]]) {
                                    packList[anContent[1]] = packList[anContent[1]].replace(new RegExp(anContent[0]), i)
                                }else{

                                    packList[anContent[1]] = anContent[1].replace(new RegExp(anContent[0]), i)
                                }
                            }
                        }
                        let values = Object.values(packList);
                        for (let i = 0; i < values.length; i++) {
                           this.answerPackList[i] = values[i].split('*')
                        }
                    } else {
                        for (let i = 1; i < answerList.length + 1; i++) {
                            this.$set(this.answerOP, i, answerList[i - 1].answerInfo);
                            if (answerList[i - 1].isTrue) {
                                if (questionType == 2) this.checkList.push(`${i}`);
                                if (questionType == 1) this.radio = `${i}`;
                            }
                        }
                    }
                }).catch(res => {
                    console.log(res);
                });
            }
        }
    };
</script>


<style lang="less">
  .traffic-editQuestion {
    background: #F0F2F5;
    height: 100%;

    .traffic-editQuestion-box{
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .traffic-editQuestion-form-choice {
      background: #ffffff;
      margin-top: 15px;
      padding: 30px 35px 10px;
    }

    .traffic-editQuestion-form-box{
      height: 1%;
      flex: 1;
      margin-top: 15px;
      padding: 20px 20px 10px;
      background: #ffffff;
      border-radius: 4px;
      overflow: auto;

      .traffic-editQuestion-stem{
        display: flex;
        margin-top: 20px;
        width: 100%;
      }

      .traffic-editQuestion-stemLeft {
        width: 8%;
        margin-left: 20px;
      }

      .traffic-editQuestion-stemRight {
        width: 80%;
      }

      .traffic-editQuestion-stemRightInput {
        margin-top: 20px;
      }

      .traffic-editQuestion-option {
        display: flex;
        margin-top: 20px;
        width: 100%;
      }

      .traffic-editQuestion-optionLeft {
        width: 8%;
        margin-left: 20px;
      }

      .traffic-editQuestion-optionRight {
        width: 84%;
      }

      .traffic-editQuestion-optionRightInput {
        margin-top: 20px;
        width: 92%;
      }

      .traffic-editQuestion-optionRightcheckbox {
        margin-top: 20px;
        width: 440% !important;
      }

      .traffic-editQuestion-add {
        width: 92%;
        margin-left: 2% !important;
        margin-top: 20px !important;
      }

      .traffic-editQuestion-analysis {
        display: flex;
        width: 100%;
        height: 120px;
        margin-top: 20px;
      }

      .traffic-editQuestion-analysisLeft {
        width: 8%;
        margin-left: 20px;
      }

      .traffic-editQuestion-analysisRight {
        width: 80%;
      }

      .traffic-editQuestion-analysisRightInput {
        margin-top: 20px;
      }

      .traffic-editQuestion-keeps {
        width: 100%;
        height: 100px;
      }

      .traffic-editQuestion-keepsRight {
        width: 80%;
        margin-top: 10px;
      }

      .traffic-editQuestion-keep {
        width: 100%;
        margin-left: 12%;
        margin-top: 30px;
      }

      .traffic-editQuestion-judge {
        margin-top: 20px;
      }


      .traffic-editQuestion-optionRightCheckbox {
        .el-checkbox__label {
          display: inline;
        }
      }

      .traffic-editQuestion-index{
        color: #606266;
        display: inline-block;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border: 1px solid #606266;
        margin-right: 10px;
        border-radius: 20px;
      }
    }
  }
  .el-button.is-circle {
    margin-left: 45%;
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .success-span {
    font-size: 200%;
    font-weight: bold;
    text-align: center;
  }
  .yesNo {
    color: #a8abb0;
    text-align: center;
    margin-top: 20px;
  }
  .teturn-button {
    text-align: center;
    margin-top: 20px;
  }
  .traffic-editPaper-success {
    text-align: center;
    padding: 0px;
  }
  .icon-del{
    cursor: pointer;
    display: inline;
  }
  .optionRight-pack-group{
    display: inline-block;
    color: #1890FF;
    line-height: 25px;
    border: 1px solid #1890FF;
    border-radius: 4px;
    padding: 3px 10px;
    margin: 15px 30px 30px;
    cursor: pointer;
  }
  .icon-del-pack{
    cursor: pointer;
    display: inline;
  }

  .optionRight-pack-add{
    .optionRight-pack-add-index{
      display: inline-block;
      width: 100px;
      text-align: right;
      padding-right: 10px;
    }
    .el-select{
      width: 75%;
      margin-right: 10px;
    }
  }
</style>
