import instance from "./request";
//拿环境变量改请求地址
const baseApi = import.meta.env.VITE_BASE_API;
//get 获取学校
export const getSchool = () => instance.get(`${baseApi}/cloudms/school/list`);

//post 学生老师注册
export const postReg = (data: any) =>
  instance.post(`${baseApi}/cloudms/user/register`, data);

//post 学生老师登录
export const postLogin = (data: any) =>
  instance.post(`${baseApi}/cloudms/user/login`, data);
//get 学生老师获取信息
export const getUserInfo = () =>
  instance.get(`${baseApi}/cloudms/user/userInfo`);
//get 学生首页获取课程
export const getStuList = (courseId: number) =>
  instance.get(`${baseApi}/cloudms/student_user/course/listCourse`);
//get 老师首页获取课程
export const getTeaList = (courseId: number) =>
  instance.get(`${baseApi}/cloudms/teacher_user/course/listCourse`);
//post 老师添加课程
export const postTeaAdd = (data: any) =>
  instance.post(`${baseApi}/cloudms/teacher_user/course/add`, data);
//post 学生添加课程
export const postStuAdd = (data: any) =>
  instance.post(`${baseApi}/cloudms/student_user/course/add`, data);
//get 学生老师课程章节
export const getCourseList = (courseId: number) =>
  instance.get(`${baseApi}/cloudms/chapter/listByCourseId/${courseId}`);
//老师添加课程章节
export const postChapterAdd = (data: any) =>
  instance.post(`${baseApi}/cloudms/chapter/add`, data);
//老师删除课程章节
export const postChapterDelete = (chapterId: number) =>
  instance.post(`${baseApi}/cloudms/chapter/delete`, { chapterId });
export const getLogout = () => instance.get(`${baseApi}/cloudms/user/logout`);

//get学生老师课程id获取作业
export const getHomeWork = (courseId: number) =>
  instance.get(`${baseApi}/cloudms/homework/listByCourseId/${courseId}`);

//get 学生老师课程id获取资料
export const getFile = (data: any) =>
  instance.get(`${baseApi}/cloudms//courseFile/listByCourseId?${data}`);

//get 老师获取实例列表
export const pjtTeaList = (id: number) =>
  instance.get(`${baseApi}/cloudms/teacher_k8s/pjt_list?courseId=${id}`);
//get 老师获取详细信息
export const pjtInfo = (pjtId: number) =>
  instance.get(`${baseApi}/cloudms/teacher_k8s/pjt_info?pjtId=${pjtId}`);
//get 学生获取实例
export const pjtStuList = (id: number) =>
  instance.get(`${baseApi}/cloudms/student_k8s/pjt_list?courseId=${id}`);
//老师添加实训
//get 实训名称是否存在
export const isTestName = (pjtName: string, courseId: number) =>
  instance.get(
    `${baseApi}/cloudms/teacher_k8s/pjt_exist?pjtName=${pjtName}&courseId=${courseId}`
  );
//get 实训是否冲突，修改时调用
export const isConflict = (pjtName: string, courseId: number, pjtId: number) =>
  instance.get(
    `${baseApi}/cloudms/teacher_k8s/pjt_conflict?pjtName=${pjtName}&courseId=${courseId}&pjtId=${pjtId}`
  );

//get 镜像搜索
export const imageSearch = (imageName: string) =>
  instance.get(
    `${baseApi}/cloudms/teacher_k8s/image_search?imageName=${imageName}`
  );
//post 获取镜像环境变量信息
export const getImgInfo = (imageName: string, tagName: string) =>
  instance.post(`${baseApi}/cloudms/teacher_k8s/get_imageInfo`, {
    imageName,
    tagName,
  });
//get 标签搜索
export const tagSearch = (imageName: string) =>
  instance.get(
    `${baseApi}/cloudms/teacher_k8s/tag_search?imageName=${imageName}`
  );
//云平台资源是否足够
export const isResourcesEnough = (
  count: number,
  limitsCpu: number,
  limitsMemory: number
) =>
  instance.get(
    `${baseApi}/cloudms/teacher_k8s/is_resources_enough?count=${count}&limitsCpu=${limitsCpu}&limitsMemory=${limitsMemory}`
  );
//镜像是否下载成功
export const isImagePull = (imageName: string, tagName: string) =>
  instance.get(
    `${baseApi}/cloudms/teacher_k8s/image_pull?imageName=${imageName}&tagName=${tagName}`
  );
//POD创建测试
export const isPodCreate = (data: any) =>
  instance.post(`${baseApi}/cloudms/teacher_k8s/is_pod_create`, data, {
    headers: { "Content-Type": "application/json" },
  });

//添加实训
export const addPjt = (data: any) =>
  instance.post(`${baseApi}/cloudms/teacher_k8s/add_pjt`, data, {
    headers: { "Content-Type": "application/json" },
  });

// 老师修改实训
export const changePjt = (data: any) =>
  instance.post(`${baseApi}/cloudms/teacher_k8s/up_pjt`, data, {
    headers: { "Content-Type": "application/json" },
  });
//老师获取实例列表
export const podList = (pjtId: number) =>
  instance.get(`${baseApi}/cloudms/teacher_k8s/pod_list?pjtId=${pjtId}`);
//老师更新实例
export const PostChangePod = (data: any) =>
  instance.post(`${baseApi}/cloudms/teacher_k8s/up_pod`, data, {
    headers: { "Content-Type": "application/json" },
  });
//老师修改实训状态
export const upPjtStatus = (pjtId: number, status: number) =>
  instance.post(`${baseApi}/cloudms/teacher_k8s/up_pjt_status`, {
    pjtId,
    status,
  });
//老师修改实例状态
export const upPodStatus = (podId: number, status: number) =>
  instance.post(`${baseApi}/cloudms/teacher_k8s/up_pod_status`, {
    podId,
    status,
  });
//学生创建实例
export const getCreatePod = (pjtId: number) =>
  instance.get(`${baseApi}/cloudms/student_k8s/create_pod?pjtId=${pjtId}`);

//学生获取实例详细信息
export const getPodInfo = (podId: number) =>
  instance.get(`${baseApi}/cloudms/student_k8s/pod_info?podId=${podId}`);

//学生获取实训资源信息
export const podResources = (pjtId: number, podId: number) =>
  instance.get(
    `${baseApi}/cloudms/student_k8s/pod_resources?pjtId=${pjtId}&podId=${podId}`
  );
//学生教师用户下载课程资料
export const downLoad = (filePath: string) =>
  instance.get(
    `${baseApi}/cloudms/courseFile/downloadFile?filePath=${filePath}`
  );
export const postFileDelete = (courseId: number, fileId: number) =>
  instance.post(`${baseApi}/cloudms/courseFile/delete`, {
    courseId,
    fileId,
  });
//老师取消授课
export const postCourseDelete = (courseId: number) =>
  instance.post(`${baseApi}/cloudms/teacher_user/course/delete`, { courseId });

//老师添加作业
export const postAddHomework = (data: any) =>
  instance.post(`${baseApi}/cloudms/teacher_homework/addOuterHomework`, data, {
    headers: { "Content-Type": "application/json" },
  });

//老师学生根据id获取作业
export const getHomework = (courseId: number) =>
  instance.get(`${baseApi}/cloudms/homework/listByCourseId/${courseId}`);

//老师修改作业信息
export const putUpdateHomework = (data: any) =>
  instance.put(
    `${baseApi}/cloudms/teacher_homework/updateOuterHomework`,
    data,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

// 学生教师用户获取课程作业题目信息（场景：学生做题目，教师修改题目，教师批改作业）
export const listByHomeworkId = (homeworkId: number, studentId: number) =>
  instance.get(
    `${baseApi}/cloudms/homework/listByHomeworkId/${homeworkId}/${studentId}`
  );

//教师添加或者修改作业题目
export const postOperationHomework = (data: any) =>
  instance.post(
    `${baseApi}/cloudms/teacher_homework/operationQuestionInsideHomework`,
    data,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

export const listStuHomework = (courseId: number, homeworkId: number) =>
  instance.get(
    `${baseApi}/cloudms/teacher_homework/listStudentInsideHomework?courseId=${courseId}&homeworkId=${homeworkId}`
  );

//教师用户删除作业题目
export const deleteQuestion = (questionId: number) =>
  instance.delete(
    `${baseApi}/cloudms/teacher_homework/deleteQuestion/${questionId}`
  );

//学生提交作业
export const addHomeworkAnswer = (data: any) =>
  instance.post(`${baseApi}/cloudms/student_homework/addHomeworkAnswer`, data, {
    headers: { "Content-Type": "application/json" },
  });

//教师用户批改学生作业提交接口
export const correctionHomework = (data: any) =>
  instance.post(
    `${baseApi}/cloudms/teacher_homework/correctionInsideHomework`,
    data,
    { headers: { "Content-Type": "application/json" } }
  );
