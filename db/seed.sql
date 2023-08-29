USE employeesDB;

INSERT INTO department
  (name)
VALUES
  ('Research'),
  ('Engineering'),
  ('Sales'),
  ('Finance'),
  ('Legal'),
  ('Audit');

-- Inserts roles of employee into role table
INSERT INTO role
  (title, salary, department_id)
VALUES
  ('Scientist', 215000, 1),
  ('Software Engineer', 115000, 2),
  ('Salesperson', 85000, 3),
  ('Accountant', 125000, 4),
  ('Lawyer', 150000, 5),
  ('Audit', 120000, 6);


-- Inserts employee information into employee table
INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Yves', 'Lapin', 1, 4),
  ('Malika', 'Toucouleur', 2, 3),
  ('Sharifa', 'Menhar', 3, 1),
  ('Stephan', 'Zabrasky', 4, 5),
  ('Shaban', 'Mouarad', 3, 5);