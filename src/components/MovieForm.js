import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Button, DatePicker, message } from "antd";
import moment from "moment";
import axios from "axios";

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 16,
  },
};

const MovieForm = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState({});

  const handleSave = async (values) => {
    setLoading(true);
    try {
      await axios.patch(`/api/movies/${id}`, values);
      message.success("Movie updated successfully");
    } catch (error) {
      console.log(error);
      message.error("Error updating movie");
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`/api/movies/${id}`);
        setMovie(response.data);
        form.setFieldsValue({
          title: response.data.title,
          description: response.data.description,
          release_date: moment(response.data.release_date),
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchMovie();
  }, [id, form]);

  return (
    <div>
      <h2>Edit Movie</h2>
      <Form
        {...layout}
        form={form}
        name="movieForm"
        onFinish={handleSave}
        initialValues={{ release_date: moment(movie.release_date) }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input a title" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input a description" }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Release Date"
          name="release_date"
          rules={[{ required: true, message: "Please select a release date" }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MovieForm;
